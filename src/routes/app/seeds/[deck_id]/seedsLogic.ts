import { userDataDocFactory } from '$lib/db/docsBoilerplate';
import { db } from '$lib/firebase/firebase';
import { uniqueID } from '$lib/helpers';
import { user } from '$lib/stores/authStores';
import { syncInProgress, userDocs } from '$lib/stores/dbStores';
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

async function updateSeedsDecksDb(docId: string, updatedDecksArray: SeedsDeckType[]) {
	// Update doc
	const docRef = doc(db, 'users', docId);

	syncInProgress.set(true);
	await updateDoc(docRef, { seedsDecks: updatedDecksArray });
	syncInProgress.set(false);
}

export async function createSeed(newSeed: SeedType, deck: SeedsDeckType) {
	const usrDocs = get(userDocs);
	const deckWithSeed = cloneDeep(deck);
	deckWithSeed.seeds = [newSeed];

	// Add seed to any doc if enough space
	for (let i = 0; i < usrDocs.length; i++) {
		const spaceLeft = usrDocs[i].remainingSpace - sizeof(deckWithSeed);
		const documentId = usrDocs[i].docID;

		if (spaceLeft > 0) {
			const docDecks = usrDocs[i].doc.seedsDecks;
			const updatedDecksArray = cloneDeep(docDecks);
			// Check if doc already contains deck, if so add seed
			for (let j = 0; j < docDecks.length; j++) {
				if (docDecks[j].id === deck.id) {
					updatedDecksArray[j].seeds.push(newSeed);
					
					// Push to db
					updateSeedsDecksDb(documentId, updatedDecksArray);
					return;
				}
			}
			// If it doesn't contain deck, add it with new seed inside
			updatedDecksArray.push(deckWithSeed);
			// Push to db
			updateSeedsDecksDb(documentId, updatedDecksArray);
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
