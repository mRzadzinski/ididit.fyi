import { userDocs } from '$lib/stores/dbStores';
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
