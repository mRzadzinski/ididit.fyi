import { userDataDocFactory } from '$lib/db/docsBoilerplate';
import { db } from '$lib/firebase/firebase';
import { user } from '$lib/stores/authStores';
import { userDocs } from '$lib/stores/dbStores';
import { addDoc, arrayUnion, collection, doc, updateDoc, writeBatch } from 'firebase/firestore';
import sizeof from 'firestore-size';
import { cloneDeep, isEqual } from 'lodash';
import { get } from 'svelte/store';

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

export async function updateDeck(updatedDeck: SeedsDeckType) {
	const docInfo = getDocInfoByDeckID(updatedDeck.id);
	const parentDocID = docInfo?.doc.docID;
	const parentDocRemainingSpace = docInfo?.doc.remainingSpace;
	const prevDeck = docInfo?.doc.doc.seedsData.decks[docInfo.oldDeckIndex];
	const prevDeckSize = sizeof(prevDeck);
	const updatedDeckSize = sizeof(updatedDeck);
	let newDeckArray: SeedsDeckType[] = [];
	let enoughSpaceInParentDoc = true;

	if (docInfo) {
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

		// If not enough space in parent doc, check remaining docs and add deck if possible
		// userDocs are already sorted by space left, ascending
		if (!enoughSpaceInParentDoc) {
			for (let i = 0; i < get(userDocs).length; i++) {
				const document = get(userDocs)[i];
				const docSize = document.remainingSpace;
				const spaceLeft = docSize - updatedDeckSize;

				if (spaceLeft > 0 && document.docID !== parentDocID) {
					const docRef = doc(db, 'users', document.docID);
					await updateDoc(docRef, {
						'seedsData.decks': arrayUnion(updatedDeck)
					});
					break;
				}
			}
		}

		// If none of docs can fit updated deck, create new doc and add here
		if (!enoughSpaceInParentDoc) {
			let docObj;
			const usr = get(user);
			if (usr && typeof usr === 'object') {
				docObj = userDataDocFactory(usr.uid);
			}
			docObj?.seedsData.decks.push(updatedDeck);
			await addDoc(collection(db, 'users'), docObj);
		}

		// Remove deck from parent doc
		// Prepare new decks array to replace the old one in parent doc
		newDeckArray = cloneDeep(docInfo.doc.doc.seedsData.decks);
		newDeckArray.splice(docInfo.oldDeckIndex, 1);
		// Update doc in firestore
		const docRef = doc(db, 'users', parentDocID);
		await updateDoc(docRef, {
			'seedsData.decks': newDeckArray
		});
	}
}

export async function reorderSeeds(initialPosition: number, droppedPosition: number) {
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
			if (scannedDeckPosition === initialPosition) {
				decksClone[i].order = droppedPosition;
			}

			// Reorder decks in between
			if (initialPosition < droppedPosition) {
				if (scannedDeckPosition > initialPosition && scannedDeckPosition <= droppedPosition) {
					decksClone[i].order--;
				}
			} else if (initialPosition > droppedPosition) {
				if (scannedDeckPosition < initialPosition && scannedDeckPosition >= droppedPosition) {
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
	console.log('Initial: ' + initialPosition);
	console.log('Dropped: ' + droppedPosition);
}

// async function fillDocs() {
// 	for (let i = 0; i < $userDocs.length; i++) {
// 		const docRef = doc(db, 'users', $userDocs[i].docID);
// 		await updateDoc(docRef, {
// 			toRemove: generateRandomPassword(920000)
// 		});
// 	}
// 	console.log('docs filled');
// }
// fillDocs();
