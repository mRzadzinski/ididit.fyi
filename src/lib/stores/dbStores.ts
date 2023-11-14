import { auth, db } from '$lib/firebase/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { derived, get, writable } from 'svelte/store';
import { onAuthStateChanged, type Unsubscribe } from 'firebase/auth';
import sizeof from 'firestore-size';

export const syncInProgress = writable<boolean>(false);
export const userDocs = writable<UserDoc[]>([]);
export const subscription = writable();
export const seedsData = derived(userDocs, ($userDocs) => {
	const data: Seeds = {
		decks: [],
		seeds: []
	};
	for (let i = 0; i < $userDocs.length; i++) {
		data.decks = data.decks.concat($userDocs[i].doc.seedsData.decks);
		data.seeds = data.seeds.concat($userDocs[i].doc.seedsData.seeds);
	}
	return data;
});

export let unsubscribeDocs: Unsubscribe;

// Get logged user data from Firestore
onAuthStateChanged(auth, async (currentUser) => {
	if (currentUser) {
		// Get user docs and listen to changes
		const q = query(collection(db, 'users'), where('uid', '==', currentUser.uid));
		unsubscribeDocs = onSnapshot(q, (querySnapshot) => {
			const docs: UserDoc[] = get(userDocs);

			// See what changed
			querySnapshot.docChanges().forEach((change) => {
				// Add new docs
				if (change.type === 'added') {
					const newDoc = change.doc;
					docs.push({
						remainingSpace: 1000000 - sizeof(newDoc.data()),
						doc: newDoc.data(),
						docID: newDoc.id
					});
					// console.log('New: ', change.doc.id);
				}
				// Modify
				if (change.type === 'modified') {
					const newRemainingSpace = 1000000 - sizeof(change.doc.data());
					const updatedDoc = change.doc.data();

					for (let i = 0; i < docs.length; i++) {
						if (change.doc.id === docs[i].docID) {
							docs[i].remainingSpace = newRemainingSpace;
							docs[i].doc = updatedDoc;
						}
					}
					// console.log('Modified: ', change.doc.id);
				}
				// Remove
				if (change.type === 'removed') {
					docs.filter((doc) => doc.docID !== change.doc.id);
					// console.log('Removed: ', change.doc.id);
				}
			});

			// Save subscription info
			for (let i = 0; i < docs.length; i++) {
				if (docs[i].doc.subscription) {
					subscription.set(docs[i].doc.subscription);
				}
			}
			// Sort docs by remainingSpace ascending
			docs.sort((prev, next) => {
				return prev.remainingSpace - next.remainingSpace;
			});
			// Save documents data in store
			userDocs.set(docs);
		});
	}
});

export function clearAppData() {
	unsubscribeDocs();
	subscription.set({});
}
