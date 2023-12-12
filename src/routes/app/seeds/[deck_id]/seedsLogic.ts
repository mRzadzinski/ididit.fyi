import { userDataDocFactory } from '$lib/db/docsBoilerplate';
import { db } from '$lib/firebase/firebase';
import { uniqueID } from '$lib/helpers';
import { user } from '$lib/stores/authStores';
import { settings, syncInProgress, userDocs } from '$lib/stores/dbStores';
import { Timestamp, addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import sizeof from 'firestore-size';
import { cloneDeep } from 'lodash';
import { get, writable } from 'svelte/store';

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

async function updateSeedsDecksDb(docId: string, updatedDecks: SeedsDeckType[]) {
	// Update doc
	const docRef = doc(db, 'users', docId);

	syncInProgress.set(true);
	await updateDoc(docRef, { seedsDecks: updatedDecks });
	syncInProgress.set(false);
}

export async function createSeed(newSeed: SeedType, deck: SeedsDeckType) {
	const usrDocs = get(userDocs);
	const deckWithSeed = {
		id: deck.id,
		name: deck.name,
		dailyLimit: deck.dailyLimit,
		order: deck.order,
		seeds: [newSeed] as SeedType[]
	} as SeedsDeckType;

	// Add seed to any doc if enough space
	for (let i = 0; i < usrDocs.length; i++) {
		const spaceLeft = usrDocs[i].remainingSpace - sizeof(deckWithSeed);
		const documentId = usrDocs[i].docID;

		if (spaceLeft > 0) {
			const docDecks = usrDocs[i].doc.seedsDecks;
			const updatedDecks = cloneDeep(docDecks);
			// Check if doc already contains deck, if so add seed
			for (let j = 0; j < docDecks.length; j++) {
				if (docDecks[j].id === deck.id) {
					updatedDecks[j].seeds.push(newSeed);

					// Push to db
					updateSeedsDecksDb(documentId, updatedDecks);
					return;
				}
			}
			// If it doesn't contain deck, add it with new seed inside
			updatedDecks.push(deckWithSeed);
			// Push to db
			updateSeedsDecksDb(documentId, updatedDecks);
			return;
		}
	}
	// If all docs are full, create new one
	let newDoc;
	const usr = get(user);
	if (usr && typeof usr === 'object') {
		newDoc = userDataDocFactory(usr.uid);
	}
	// Add parent deck containing only new seed to new doc
	const parentDeckClone = cloneDeep(deck);
	parentDeckClone.seeds = [newSeed];
	newDoc?.seedsDecks.push(parentDeckClone);

	// Push to db
	syncInProgress.set(true);
	await addDoc(collection(db, 'users'), newDoc);
	syncInProgress.set(false);
}

export async function deleteSeed(seedId: string, deckId: string) {
	const usrDocs = get(userDocs);
	let documentId = '';
	let updatedDecks: SeedsDeckType[] = [];
	let deckIndex: number | undefined;
	let seedIndex: number | undefined;
	let seedFound = false;
	let deckCopiesExist = false;
	let exitLoops = false;

	// Find seed location in docs
	// If deck will be empty after removing seed, check if it has copies in other docs so it can be removed
	for (let i = 0; i < usrDocs.length; i++) {
		if (exitLoops) break;
		const decks = usrDocs[i].doc.seedsDecks;

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
				// Seed and deck copy was found so terminate loops
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
	updateSeedsDecksDb(documentId, updatedDecks);
	return;
}

// Could be shorter but this way is more readable
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
	}else if (order === 'old-new') {
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