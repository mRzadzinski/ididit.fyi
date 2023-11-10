import { auth, db } from '$lib/firebase/firebase';
import { collection, onSnapshot, query, type DocumentData, where } from 'firebase/firestore';
import { get, writable } from 'svelte/store';
import { onAuthStateChanged, type Unsubscribe } from 'firebase/auth';
import { isEqual } from 'lodash';
import sizeof from 'firestore-size';

export const userDocs = writable<DocumentData[]>([]);
export const subscription = writable<object[]>([]);
export const seedsData = writable<Seeds>({
	decks: [],
	seeds: []
});

export let unsubscribeDocs: Unsubscribe;

// Get logged user data from Firestore
onAuthStateChanged(auth, async (currentUser) => {
	if (currentUser) {
		// Get user docs and listen to changes
		const q = query(collection(db, 'users'), where('uid', '==', currentUser.uid));
		unsubscribeDocs = onSnapshot(q, (querySnapshot) => {
			const docsArray: DocumentData[] = [];
			const docsInfo: DocsInfo[] = [];
			const allSeeds: Seeds = { decks: [], seeds: [] };
			const changedDocs: DocumentData[] = [];

			// Get initial array of user documents
			// if (docsArray.length === 0) {
				querySnapshot.forEach((doc) => {
					docsArray.push(doc.data());
					docsInfo.push({
						remainingSpace: 1000000 - sizeof(doc.data()),
						doc: doc.data(),
						docID: doc.id
					});
				});
			// }

			// See what changed
			querySnapshot.docChanges().forEach((change) => {
				if (change.type === 'added') {
					console.log('New: ', change.doc.data());
				}
				if (change.type === 'modified') {
					console.log('Modified: ', change.doc.data());
				}
				if (change.type === 'removed') {
					console.log('Removed: ', change.doc.data());
				}
			});

			docsArray.forEach((doc) => {
				// Save subscription info from master document
				if (doc.subscription) {
					if (!isEqual(get(subscription), doc.subscription)) {
						subscription.set(doc.subscription);
					}
				}

				// Extract app data
				allSeeds.decks = allSeeds.decks.concat(doc.seedsData.decks);
				allSeeds.seeds = allSeeds.seeds.concat(doc.seedsData.seeds);
			});

			// Compare with current data and update
			if (!isEqual(get(seedsData), allSeeds)) seedsData.set(allSeeds);

			// Sort docsInfo by remainingSpace ascending
			docsInfo.sort((prev, next) => {
				return prev.remainingSpace - next.remainingSpace;
			});
			// Save documents data in store for comparison and size info
			userDocs.set(docsInfo);
		});
	}
});

export function clearAppData() {
	unsubscribeDocs();
	subscription.set([]);
	seedsData.set({ decks: [], seeds: [] });
}
