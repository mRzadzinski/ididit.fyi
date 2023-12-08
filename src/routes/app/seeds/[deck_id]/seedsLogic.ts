import { userDataDocFactory } from '$lib/db/docsBoilerplate';
import { db } from '$lib/firebase/firebase';
import { user } from '$lib/stores/authStores';
import { syncInProgress, userDocs } from '$lib/stores/dbStores';
import { collection, doc, writeBatch } from 'firebase/firestore';
import sizeof from 'firestore-size';
import { cloneDeep, isEqual } from 'lodash';
import { get, writable } from 'svelte/store';

export const expandedSeedId = writable('');
export const seedsOrderByOptions = [
	{ name: 'New - old', value: 'new-old' },
	{ name: 'Old - new', value: 'old-new' },
	{ name: 'A - z', value: 'a-z' },
	{ name: 'Z - a', value: 'z-a' }
];

export async function createSeed(newSeed: SeedType, deckId: string) {
	const batch = writeBatch(db);
	const seedSize = sizeof(newSeed);
	const usrDocs = get(userDocs);
	let parentDoc: DocumentType;
	let deck: SeedsDeckType;
	let seedCreated = false;

	// Add seed to deck if enough space in doc
	// Find doc containing deck
	for (let i = 0; i < usrDocs.length; i++) {
		const decks = usrDocs[i].doc.seedsDecks;
		for (let j = 0; j < decks; j++) {
			if (decks[j].id === deckId) {
				parentDoc = usrDocs[i];
				deck = decks[j];
				console.log(parentDoc)
				// let parentDocID = parentDoc.doc


			}
		}
	}

	// Check to which doc add new seed
	// for (let i = 0; i < usrDocs.length; i++) {
	// 	const document = usrDocs[i];
	// 	const documentId = document.docID;
	// 	const documentSize = document.remainingSpace;
	// 	const spaceLeft = documentSize - seedSize;
	// 	const decksArray = document.doc.seedsDecks;
	// 	const updatedDecksArray = cloneDeep(decksArray);

	// 	// Add new deck if there's enough space in docs
	// 	if (spaceLeft > 0 && !seedCreated) {
	// 		updatedDecksArray.push(newSeed);
	// 		seedCreated = true;
	// 	}

	// 	// If anything changed in deck, add to batch update
	// 	if (!isEqual(decksArray, updatedDecksArray)) {
	// 		const docRef = doc(db, 'users', documentId);
	// 		batch.update(docRef, { seedsDecks: updatedDecksArray });
	// 	}
	// }
	// // If there was no space in docs, create new one and add deck
	// if (!seedCreated) {
	// 	let docObj;
	// 	const usr = get(user);
	// 	if (usr && typeof usr === 'object') {
	// 		docObj = userDataDocFactory(usr.uid);
	// 	}
	// 	docObj?.seedsDecks.push(newSeed);

	// 	const docRef = doc(collection(db, 'users'));
	// 	batch.set(docRef, docObj);
	// }
	// syncInProgress.set(true);
	// await batch.commit();
	// syncInProgress.set(false);
}
