import { userDataDocFactory } from '$lib/db/docsBoilerplate';
import { db } from '$lib/firebase/firebase';
import { generateRandomPassword, uniqueID } from '$lib/helpers';
import { user } from '$lib/stores/authStores';
import { userDocs } from '$lib/stores/dbStores';
import { arrayUnion, collection, doc, updateDoc, writeBatch } from 'firebase/firestore';
import sizeof from 'firestore-size';
import { cloneDeep, isEqual } from 'lodash';
import { get } from 'svelte/store';

export async function createDeck(newDeck: SeedsDeckType) {
	const batch = writeBatch(db);
	const deckSize = sizeof(newDeck);
	let deckCreated = false;

	// Check to which doc add new deck
	for (let i = 0; i < get(userDocs).length; i++) {
		const document = get(userDocs)[i];
		const documentId = document.docID;
		const documentSize = document.remainingSpace;
		const spaceLeft = documentSize - deckSize;
		const decksArray = document.doc.seedsData.decks;
		const updatedDecksArray = cloneDeep(decksArray);

		// Add new deck if there's enough space in docs
		if (spaceLeft > 0 && !deckCreated) {
			updatedDecksArray.push(newDeck);
			deckCreated = true;
		}

		// Increment position of all other decks
		for (let j = 0; j < updatedDecksArray.length; j++) {
			if (newDeck.id !== updatedDecksArray[j].id) updatedDecksArray[j].order += 1;
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

	await batch.commit();
}

export async function deleteDeck(deckToDeleteOrder: number) {
	const batch = writeBatch(db);

	// Find deck location in docs
	for (let i = 0; i < get(userDocs).length; i++) {
		const document = get(userDocs)[i];
		const documentId = document.docID;
		const decksArray = document.doc.seedsData.decks;
		const updatedDecksArray = cloneDeep(decksArray);

		for (let j = 0; j < updatedDecksArray.length; j++) {
			const scannedDeck = updatedDecksArray[j];
			const scannedDeckOrder = scannedDeck.order;
			// Delete deck
			if (scannedDeckOrder === deckToDeleteOrder) {
				updatedDecksArray.splice(j, 1);
			}
			// Reorder decks
			else if (scannedDeckOrder > deckToDeleteOrder) {
				scannedDeck.order -= 1;
			}
		}
		// If anything changed in deck, add to batch update
		if (!isEqual(decksArray, updatedDecksArray)) {
			const docRef = doc(db, 'users', documentId);
			batch.update(docRef, { 'seedsData.decks': updatedDecksArray });
		}
	}
	await batch.commit();
}

export async function updateDeck(updatedDeck: SeedsDeckType) {
	const docInfo = getDocInfoByDeckID(updatedDeck.id);

	if (docInfo) {
		const parentDocID = docInfo?.doc.docID;
		const parentDocRemainingSpace = docInfo?.doc.remainingSpace;
		const prevDeck = docInfo?.doc.doc.seedsData.decks[docInfo.oldDeckIndex];
		const prevDeckSize = sizeof(prevDeck);
		const updatedDeckSize = sizeof(updatedDeck);
		let newDeckArray: SeedsDeckType[] = [];
		let enoughSpaceInParentDoc = true;

		// Check if deck size increased
		if (updatedDeckSize > prevDeckSize) {
			// Check if there in enough space in doc
			const spaceToAdd = updatedDeckSize - prevDeckSize;
			const spaceLeft = parentDocRemainingSpace - spaceToAdd;
			spaceLeft > 0 ? (enoughSpaceInParentDoc = true) : (enoughSpaceInParentDoc = false);
		}

		// Update parent doc if possible
		if (enoughSpaceInParentDoc) {
			// Prepare new decks array to replace the old one in parent doc
			newDeckArray = cloneDeep(docInfo.doc.doc.seedsData.decks);
			newDeckArray[docInfo.oldDeckIndex] = updatedDeck;
			// Update doc in firestore
			const docRef = doc(db, 'users', parentDocID);
			await updateDoc(docRef, {
				'seedsData.decks': newDeckArray
			});
			return;
		}

		const batch = writeBatch(db);
		// If not enough space in parent doc, check remaining docs and add deck if possible
		// userDocs are already sorted by space left, ascending
		if (!enoughSpaceInParentDoc) {
			let added = false;
			for (let i = 0; i < get(userDocs).length; i++) {
				const document = get(userDocs)[i];
				const docSize = document.remainingSpace;
				const spaceLeft = docSize - updatedDeckSize;

				if (spaceLeft > 0 && document.docID !== parentDocID) {
					const docRef = doc(db, 'users', document.docID);
					batch.update(docRef, { 'seedsData.decks': arrayUnion(updatedDeck) });
					added = true;
					break;
				}
			}
			// If none of docs can fit updated deck, create new doc and add here
			if (!added) {
				let docObj;
				const usr = get(user);
				if (usr && typeof usr === 'object') {
					docObj = userDataDocFactory(usr.uid);
				}
				docObj?.seedsData.decks.push(updatedDeck);

				const docRef = doc(collection(db, 'users'));
				batch.set(docRef, docObj);
			}
		}

		// Remove deck from parent doc
		// Prepare new decks array to replace the old one in parent doc
		newDeckArray = cloneDeep(docInfo.doc.doc.seedsData.decks);
		newDeckArray.splice(docInfo.oldDeckIndex, 1);
		// Update doc in firestore
		const docRef = doc(db, 'users', parentDocID);
		batch.update(docRef, { 'seedsData.decks': newDeckArray });

		// Push changes
		await batch.commit();
	}
}

export async function reorderSeeds(initialPosition: number, droppedPosition: number) {
	// Increment order to switch back to 1 based index from 0 in client (dnd positioning)
	const dbInitialPosition = initialPosition;
	const dbdroppedPosition = droppedPosition;
	const batch = writeBatch(db);

	// Scan all user docs
	get(userDocs).forEach((document) => {
		const docID = document.docID;
		const decksArray = document.doc.seedsData.decks;
		const decksClone = cloneDeep(decksArray);

		// Scan all decks in each document
		for (let i = 0; i < decksClone.length; i++) {
			const scannedDeckPosition = decksClone[i].order;

			// Reorder dropped deck
			if (scannedDeckPosition === dbInitialPosition) {
				decksClone[i].order = dbdroppedPosition;
			}

			// Reorder decks in between
			if (dbInitialPosition < dbdroppedPosition) {
				if (scannedDeckPosition > dbInitialPosition && scannedDeckPosition <= dbdroppedPosition) {
					decksClone[i].order--;
				}
			} else if (dbInitialPosition > dbdroppedPosition) {
				if (scannedDeckPosition < dbInitialPosition && scannedDeckPosition >= dbdroppedPosition) {
					decksClone[i].order++;
				}
			}
		}

		// If any changes were made in doc, prepare update
		if (!isEqual(decksClone, decksArray)) {
			const docRef = doc(db, 'users', docID);
			batch.update(docRef, { 'seedsData.decks': decksClone });
		}
	});

	await batch.commit();
}

export async function manageAllSeedsOrder(action: string) {
	const batch = writeBatch(db);

	// Scan all user docs
	get(userDocs).forEach((document) => {
		const docID = document.docID;
		const decksArray = document.doc.seedsData.decks;
		const decksClone = cloneDeep(decksArray);

		// Increment order for all decks
		for (let i = 0; i < decksClone.length; i++) {
			if (action === 'increment') {
				decksClone[i].order += 1;
			} else if (action === 'decrement') {
				decksClone[i].order -= 1;
			}
		}

		// If any changes were made in doc, prepare update
		if (!isEqual(decksClone, decksArray)) {
			const docRef = doc(db, 'users', docID);
			batch.update(docRef, { 'seedsData.decks': decksClone });
		}
	});

	await batch.commit();
}

export function deckFactory() {
	return {
		id: uniqueID(),
		name: '',
		dailyLimit: 0,
		order: 0
	};
}

export function getDocInfoByDeckID(seedID: string) {
	const docs = get(userDocs);
	for (let i = 0; i < docs.length; i++) {
		for (let j = 0; j < docs[i].doc.seedsData.decks.length; j++) {
			const scannedSeedID = docs[i].doc.seedsData.decks[j].id;
			if (scannedSeedID === seedID) {
				return { doc: docs[i], oldDeckIndex: j };
			}
		}
	}
}

export async function fillDocs() {
	const docs = get(userDocs);
	const randomString = generateRandomPassword(1020000);
	for (let i = 0; i < docs.length; i++) {
		const docRef = doc(db, 'users', docs[i].docID);
		await updateDoc(docRef, {
			toRemove: randomString
		});
	}
	console.log('docs filled');
}
