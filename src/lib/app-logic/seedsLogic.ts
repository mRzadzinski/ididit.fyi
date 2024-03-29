import { db } from '$lib/firebase/firebase';
import { uniqueID } from '$lib/helpers';
import { settings, syncInProgress, userDocs } from '$lib/stores/dbStores';
import { Timestamp, addDoc, collection, doc, updateDoc, writeBatch } from 'firebase/firestore';
import sizeof from 'firestore-size';
import { cloneDeep } from 'lodash';
import { get, writable } from 'svelte/store';
import { createNewDataDoc } from './commonLogic';

export const expandedSeedId = writable('');
export const seedsOrderByOptions = [
	{ name: 'New - old', value: 'new-old' },
	{ name: 'Old - new', value: 'old-new' },
	{ name: 'A - Z', value: 'a-z' },
	{ name: 'Z - A', value: 'z-a' }
];

export function SeedFactory(
	content: string,
	author: string,
	source: string,
	showEveryday: boolean
) {
	return {
		id: uniqueID(),
		date: Timestamp.now(),
		content,
		author,
		source,
		showEveryday
	} as SeedType;
}

export async function createSeed(newSeed: SeedType, deck: DeckType) {
	const usrDocs = get(userDocs);
	const deckWithSeed = {
		...deck,
		seeds: [newSeed] as SeedType[]
	} as DeckType;

	// Add seed to any doc if enough space
	for (let i = 0; i < usrDocs.length; i++) {
		const spaceLeft = usrDocs[i].remainingSpace - sizeof(deckWithSeed);
		const documentId = usrDocs[i].docID;

		if (spaceLeft > 0) {
			const docDecks = usrDocs[i].doc.seedsData.decks;
			const updatedDecks = cloneDeep(docDecks);
			// Check if doc already contains deck, if so add seed
			for (let j = 0; j < docDecks.length; j++) {
				if (docDecks[j].id === deck.id) {
					updatedDecks[j].seeds.push(newSeed);

					// Push to db
					updateDecksDb(documentId, updatedDecks);
					return;
				}
			}
			// If it doesn't contain deck, add it with new seed inside
			updatedDecks.push(deckWithSeed);
			// Push to db
			updateDecksDb(documentId, updatedDecks);
			return;
		}
	}
	// If all docs are full, create new one
	const newDoc = createDocWithDeckAndSeed(deck, newSeed);

	// Push to db
	syncInProgress.set(true);
	await addDoc(collection(db, 'users'), newDoc);
	syncInProgress.set(false);
}

export async function deleteSeed(seedId: string, deckId: string) {
	const usrDocs = get(userDocs);
	let documentId = '';
	let updatedDecks: DeckType[] = [];
	let deckIndex: number | undefined;
	let seedIndex: number | undefined;
	let seedFound = false;
	let deckCopiesExist = false;
	let exitLoops = false;

	// Find seed location in docs
	// If deck will be empty after removing seed, check if it has copies in other docs so it can be removed
	for (let i = 0; i < usrDocs.length; i++) {
		if (exitLoops) break;
		const decks = usrDocs[i].doc.seedsData.decks;

		for (let j = 0; j < decks.length; j++) {
			if (exitLoops) break;
			const seeds = decks[j].seeds;

			if (decks[j].id === deckId) {
				if (!seedFound) {
					for (let k = 0; k < seeds.length; k++) {
						if (exitLoops) break;
						if (seeds[k].id === seedId) {
							// Collect data to remove seed
							seedFound = true;
							documentId = usrDocs[i].docID;
							updatedDecks = cloneDeep(decks);
							deckIndex = j;
							seedIndex = k;

							// Terminate loops if gathered all info
							if (deckCopiesExist) {
								exitLoops = true;
							}
							break;
						}
					}
					// Seed was not found in deck with matching id so it's a copy in another doc
					if (!seedFound) {
						deckCopiesExist = true;
					}
				}
				// Seed and deck-copy was found so terminate loops
				else {
					exitLoops = true;
				}
			}
		}
	}

	if (deckIndex !== undefined && seedIndex !== undefined) {
		// If deck will become empty (contains only one seed) and it's copies exist in other docs, remove deck
		if (updatedDecks[deckIndex].seeds.length === 1 && deckCopiesExist) {
			updatedDecks.splice(deckIndex, 1);
		}
		// If other seeds in deck, remove only the seed
		else {
			updatedDecks[deckIndex].seeds.splice(seedIndex, 1);
		}
	}

	// Push to db
	updateDecksDb(documentId, updatedDecks);
	return;
}

export async function editSeed(editedSeed: SeedType, deckId: string) {
	const batch = writeBatch(db);
	const usrDocs = get(userDocs);
	let parentDocId: string | undefined;
	let parentDocIndex: number | undefined;
	let parentDeckIndex: number | undefined;
	let seedIndex: number | undefined;
	let updatedDecks: DeckType[] = [];
	let deckWithSeed: DeckType | undefined;

	let seedFound = false;
	let breakInnerLoops = false;

	// Find seed location and edit, if not enough space in parent doc, try remaining docs
	// Scan Docs
	for (let i = 0; i < usrDocs.length; i++) {
		const decks = usrDocs[i].doc.seedsData.decks;
		breakInnerLoops = false;

		if (deckWithSeed) {
			const spaceLeft = usrDocs[i].remainingSpace - sizeof(deckWithSeed);
			if (spaceLeft < 0) continue;
		}
		// Scan decks
		for (let j = 0; j < decks.length; j++) {
			if (breakInnerLoops) break;
			const seeds = decks[j].seeds;

			if (decks[j].id === deckId) {
				if (!seedFound) {
					// Scan seeds
					for (let k = 0; k < seeds.length; k++) {
						if (seeds[k].id === editedSeed.id) {
							const sizeDiff = sizeof(editedSeed) - sizeof(seeds[k]);
							const spaceLeft = usrDocs[i].remainingSpace - sizeDiff;
							parentDocId = usrDocs[i].docID;
							seedFound = true;

							// Edit seed in place
							if (spaceLeft > 0) {
								updatedDecks = cloneDeep(decks);
								updatedDecks[j].seeds[k] = editedSeed;
								updateDecksDb(parentDocId, updatedDecks);

								return;
							} else {
								// Save deck with seed inside to check space remaining in docs
								deckWithSeed = { ...decks[j], seeds: [editedSeed] };

								// Collect seed location data
								parentDocIndex = i;
								parentDeckIndex = j;
								seedIndex = k;

								// Docs are sorted by remaining space ascending, so previous doc won't fit seed anyway -> scan remaining docs
								breakInnerLoops = true;
								break;
							}
						}
					}
				}
				// Deck copy exists in doc => move seed to deck copy (if deck in initial location becomes empty, remove it)
				else {
					// Add seed to doc
					updatedDecks = cloneDeep(decks);
					updatedDecks[j].seeds.push(editedSeed);
					// Add to batch update
					const docID = usrDocs[i].docID;
					const docRef = doc(db, 'users', docID);
					batch.update(docRef, { 'seedsData.decks': updatedDecks });

					// Remove from parent doc
					removeFromParentDoc();
					return;
				}
			}
		}
		// Deck copy doesn't exist => create deck copy with edited seed inside (if deck in initial location becomes empty, remove it)
		if (deckWithSeed) {
			const spaceLeft = usrDocs[i].remainingSpace - sizeof(deckWithSeed);
			if (spaceLeft < 0) continue;

			// Add deck to doc
			updatedDecks = cloneDeep(decks);
			updatedDecks.push(deckWithSeed);
			// Add to batch update
			const docID = usrDocs[i].docID;
			const docRef = doc(db, 'users', docID);
			batch.update(docRef, { 'seedsData.decks': updatedDecks });

			// Remove from parent doc
			removeFromParentDoc();
			return;
		}
	}
	// Not enough space in existing docs
	if (deckWithSeed) {
		// Create new doc with deck copy with edited seed inside
		const newDoc = createDocWithDeckAndSeed(deckWithSeed, deckWithSeed.seeds[0]);
		const docRef = doc(collection(db, 'users'));
		batch.set(docRef, newDoc);

		removeFromParentDoc();
	}

	function removeFromParentDoc() {
		if (
			parentDocId !== undefined &&
			parentDocIndex !== undefined &&
			parentDeckIndex !== undefined &&
			seedIndex !== undefined
		) {
			updatedDecks = cloneDeep(usrDocs[parentDocIndex].doc.seedsData.decks);

			// If deck will become empty - remove whole deck, else remove only seed
			if (updatedDecks[parentDeckIndex].seeds.length === 1) {
				updatedDecks.splice(parentDeckIndex, 1);
			} else {
				updatedDecks[parentDeckIndex].seeds.splice(seedIndex, 1);
			}

			// Add to batch update
			const docRef = doc(db, 'users', parentDocId);
			batch.update(docRef, { 'seedsData.decks': updatedDecks });

			batch.commit();
		}
	}
}

// Could be less verbose but this way is more readable
export function reorderSeeds(seeds: SeedType[]) {
	const order = get(settings).seedsOrderBy;
	const reordered = seeds;

	if (order === 'a-z') {
		reordered.sort((a, b) => {
			const nameA = a.content.toUpperCase(); // ignore upper and lowercase
			const nameB = b.content.toUpperCase(); // ignore upper and lowercase
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}
			return 1;
		});
	} else if (order === 'z-a') {
		reordered.sort((a, b) => {
			const nameA = a.content.toUpperCase(); // ignore upper and lowercase
			const nameB = b.content.toUpperCase(); // ignore upper and lowercase
			if (nameA < nameB) {
				return 1;
			}
			if (nameA > nameB) {
				return -1;
			}
			return 1;
		});
	} else if (order === 'new-old') {
		reordered.sort((a, b) => {
			const nameA = a.date.toDate();
			const nameB = b.date.toDate();
			if (nameA < nameB) {
				return 1;
			}
			if (nameA > nameB) {
				return -1;
			}
			return 1;
		});
	} else if (order === 'old-new') {
		reordered.sort((a, b) => {
			const nameA = a.date.toDate();
			const nameB = b.date.toDate();
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}
			return 1;
		});
	}

	return reordered;
}

async function updateDecksDb(docId: string, updatedDecks: DeckType[]) {
	// Update doc
	const docRef = doc(db, 'users', docId);

	syncInProgress.set(true);
	await updateDoc(docRef, { 'seedsData.decks': updatedDecks });
	syncInProgress.set(false);
}

function createDocWithDeckAndSeed(deck: DeckType, seed: SeedType) {
	const docObj = createNewDataDoc();
	// Add parent deck containing only new seed to new doc
	const parentDeckClone = cloneDeep(deck);
	parentDeckClone.seeds = [seed];
	docObj?.seedsData.decks.push(parentDeckClone);

	return docObj;
}
