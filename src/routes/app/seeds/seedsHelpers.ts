import { userDocs } from '$lib/stores/dbStores';
import { get } from 'svelte/store';

export function getDocumentByDeckID(id: string) {
	const docs = get(userDocs);
	for (let i = 0; i < docs.length; i++) {
		for (let j = 0; j < docs[i].doc.seedsData.decks.length; j++) {
			const decksArray = docs[i].doc.seedsData.decks;
			const scannedDeck = decksArray[j];
			const scannedSeedID = scannedDeck.id;
			if (scannedSeedID === id) {
				return { doc: docs[i], deck: scannedDeck, oldDeckIndex: j, decksArray };
			}
		}
	}
	// console.log(get(userDocs));
}
