import { userDataDocFactory } from '$lib/db/docsBoilerplate';
import { db } from '$lib/firebase/firebase';
import { generateRandomPassword, uniqueID } from '$lib/helpers';
import { user } from '$lib/stores/authStores';
import { syncInProgress, userDocs } from '$lib/stores/dbStores';
import { collection, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { cloneDeep, isEqual } from 'lodash';
import { get } from 'svelte/store';
import type { DndReorderData } from '../dnd/verticalListLifecycle';
import sizeof from 'firestore-size';

export const decksOrderByOptions = [
	{ name: 'Custom', value: 'custom' },
	{ name: 'A - Z', value: 'a-z' }
];

export async function createDeck(newDeck: DeckType) {
	const batch = writeBatch(db);
	const usrDocs = get(userDocs);
	let deckCreated = false;

	// Check to which doc add new deck
	for (let i = 0; i < usrDocs.length; i++) {
		const document = usrDocs[i];
		const documentId = document.docID;
		const spaceLeft = document.remainingSpace - sizeof(newDeck);
		const decksArray = document.doc.seedsData.decks;
		const updatedDecksArray = cloneDeep(decksArray);

		// Add new deck if there's enough space in doc
		if (spaceLeft > 0 && !deckCreated) {
			updatedDecksArray.push(newDeck);
			deckCreated = true;
		}

		// Increment position of all other decks
		for (let j = 0; j < updatedDecksArray.length; j++) {
			if (newDeck.id !== updatedDecksArray[j].id) {
				updatedDecksArray[j].order += 1;
			}
		}

		// If anything changed in deck, add to batch update
		if (!isEqual(decksArray, updatedDecksArray)) {
			const docRef = doc(db, 'users', documentId);
			batch.update(docRef, { 'seedsData.decks': updatedDecksArray });
		}
	}
	// If there was no space in docs, create new one and add deck
	if (!deckCreated) {
		let docObj;
		const usr = get(user);
		if (usr && typeof usr === 'object') {
			docObj = userDataDocFactory(usr.uid);
		}
		docObj?.seedsData.decks.push(newDeck);

		const docRef = doc(collection(db, 'users'));
		batch.set(docRef, docObj);
	}
	syncInProgress.set(true);
	await batch.commit();
	syncInProgress.set(false);
}

export async function deleteDeck(deckId: string) {
	const batch = writeBatch(db);
	const usrDocs = get(userDocs);
	let updatedDecksArray: DeckType[] | undefined;

	// Find all deck locations in docs
	for (let i = 0; i < usrDocs.length; i++) {
		const document = usrDocs[i];
		const documentId = document.docID;
		const decks = document.doc.seedsData.decks;

		for (let j = 0; j < decks.length; j++) {
			if (decks[j].id === deckId) {
				// Delete deck
				updatedDecksArray = cloneDeep(decks);
				if (updatedDecksArray) {
					updatedDecksArray.splice(j, 1);

					// Add to batch update
					const docRef = doc(db, 'users', documentId);
					batch.update(docRef, { 'seedsData.decks': updatedDecksArray });

					break;
				}
			}
		}
	}
	syncInProgress.set(true);
	await batch.commit();
	syncInProgress.set(false);
}

export async function updateDeck(updatedDeck: DeckType) {
	const batch = writeBatch(db);
	const usrDocs = get(userDocs);
	let updatedDecks: DeckType[] = [];

	// Update all deck instances in all docs
	// Don't consider 'not enough space' scenario, there is about 15k bytes buffer to fit deck changes (name, dailyLimit)
	for (let i = 0; i < usrDocs.length; i++) {
		const documentId = usrDocs[i].docID;
		const decks = usrDocs[i].doc.seedsData.decks;

		for (let j = 0; j < decks.length; j++) {
			if (decks[j].id === updatedDeck.id) {
				// Update deck data, leave seeds unchanged
				updatedDecks = cloneDeep(decks);
				updatedDecks[j] = { ...updatedDeck, seeds: updatedDecks[j].seeds };

				// Add to batch changes
				const docRef = doc(db, 'users', documentId);
				batch.update(docRef, { 'seedsData.decks': updatedDecks });

				break;
			}
		}
	}
	// Push changes
	syncInProgress.set(true);
	await batch.commit();
	syncInProgress.set(false);
}

export async function reorderDecks(reorderData: DndReorderData[]) {
	const batch = writeBatch(db);
	const usrDocs = get(userDocs);

	// Scan all user docs => reorder all deck instances
	for (let i = 0; i < usrDocs.length; i++) {
		const docID = usrDocs[i].docID;
		const decks = usrDocs[i].doc.seedsData.decks;
		const updatedDecks = cloneDeep(decks);

		// Scan all decks in each document
		for (let j = 0; j < updatedDecks.length; j++) {
			const scannedDeck = updatedDecks[j];

			for (let k = 0; k < reorderData.length; k++) {
				if (scannedDeck.id === reorderData[k].id) {
					// Reorder deck
					scannedDeck.order = reorderData[k].order;
				}
			}
		}
		// If any changes were made in doc, prepare update
		if (!isEqual(updatedDecks, decks)) {
			const docRef = doc(db, 'users', docID);
			batch.update(docRef, { 'seedsData.decks': updatedDecks });
		}
	}
	syncInProgress.set(true);
	await batch.commit();
	syncInProgress.set(false);
}

export function deckFactory() {
	return {
		id: uniqueID(),
		name: '',
		dailyLimit: 0,
		order: 0,
		seeds: []
	};
}

export async function fillDocs() {
	const docs = get(userDocs);
	const randomString = generateRandomPassword(1038576 + 6000);
	for (let i = 0; i < docs.length; i++) {
		const docRef = doc(db, 'users', docs[i].docID);
		syncInProgress.set(true);
		await updateDoc(docRef, {
			toRemove: randomString
		});
		syncInProgress.set(false);
	}
	console.log('docs filled');
}
