import { auth, db } from '$lib/firebase/firebase';
import { collection, onSnapshot, query, type DocumentData, where } from 'firebase/firestore';
import { get, writable } from 'svelte/store';
import { onAuthStateChanged, type Unsubscribe } from 'firebase/auth';
import { isEqual } from 'lodash';
import sizeof from 'firestore-size';

export const userDocs = writable<DocumentData[]>([]);
export const subscription = writable<object[]>([]);
export const goals = writable<object[]>([]);
export const seeds = writable<object[]>([]);
export const vision = writable<object[]>([]);
export const dreams = writable<object[]>([]);
export const wishlist = writable<object[]>([]);
export const books = writable<object[]>([]);
export const proudBoard = writable<object[]>([]);
export const friends = writable<object[]>([]);

export let unsubscribeDocs: Unsubscribe;

// Get logged user data from Firestore
onAuthStateChanged(auth, async (currentUser) => {
	if (currentUser) {
		// Get user docs and listen to changes
		const q = query(collection(db, 'users'), where('uid', '==', currentUser.uid));
		unsubscribeDocs = onSnapshot(q, (querySnapshot) => {
			const docsArray: DocumentData[] = [];
			let goalsData: object[] = [];
			let seedsData: object[] = [];
			let visionData: object[] = [];
			let dreamsData: object[] = [];
			let wishlistData: object[] = [];
			let booksData: object[] = [];
			let proudBoardData: object[] = [];
			let friendsData: object[] = [];

			// Reset user docs store
			userDocs.set([]);
			// Get array of user documents
			querySnapshot.forEach((doc) => {
				docsArray.push(doc.data());
				// Save documents in store for comparison and size info
				userDocs.update((prev) => [
					...prev,
					{ size: sizeof(doc.data()), doc: doc.data(), docID: doc.id }
				]);
			});

			docsArray.forEach((doc) => {
				// Save subscription info from master document
				if (doc.subscription) subscription.set(doc.subscription);
				// Extract app data
				goalsData = [...goalsData, ...doc.goals];
				seedsData = [...seedsData, ...doc.seeds];
				visionData = [...visionData, ...doc.vision];
				dreamsData = [...dreamsData, ...doc.dreams];
				wishlistData = [...wishlistData, ...doc.wishlist];
				booksData = [...booksData, ...doc.books];
				proudBoardData = [...proudBoardData, ...doc.proudBoard];
				friendsData = [...friendsData, ...doc.friends];
			});

			// Compare with current data and update
			if (!isEqual(get(goals), goalsData)) goals.set(goalsData);
			if (!isEqual(get(seeds), seedsData)) seeds.set(seedsData);
			if (!isEqual(get(vision), visionData)) vision.set(visionData);
			if (!isEqual(get(dreams), dreamsData)) dreams.set(dreamsData);
			if (!isEqual(get(wishlist), wishlistData)) wishlist.set(wishlistData);
			if (!isEqual(get(books), booksData)) books.set(booksData);
			if (!isEqual(get(proudBoard), proudBoardData)) proudBoard.set(proudBoardData);
			if (!isEqual(get(friends), friendsData)) friends.set(friendsData);
		});
	}
});

export function clearAppData() {
	unsubscribeDocs();
	subscription.set([]);
	goals.set([]);
	seeds.set([]);
	vision.set([]);
	dreams.set([]);
	wishlist.set([]);
	books.set([]);
	proudBoard.set([]);
	friends.set([]);
}
