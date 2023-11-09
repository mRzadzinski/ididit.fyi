import { userDataDocFactory } from '$lib/db/docsBoilerplate';
import { db } from '$lib/firebase/firebase';
import { user } from '$lib/stores/authStores';
import { userDocs } from '$lib/stores/dbStores';
import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore';
import sizeof from 'firestore-size';
import { cloneDeep } from 'lodash';
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