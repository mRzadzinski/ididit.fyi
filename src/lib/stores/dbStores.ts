import { auth, db } from '$lib/firebase/firebase';
import { collection, onSnapshot, query, type DocumentData, where } from 'firebase/firestore';
import { writable } from 'svelte/store';
import { onAuthStateChanged, type Unsubscribe } from 'firebase/auth';
import sizeof from 'firestore-size';

export const accountData = writable();
export const subscription = writable<object[]>([]);
export const goals = writable<object[]>([{ prop: 1 }]);
export const seeds = writable<object[]>([{ name: 'wisdom', author: 'Bob' }]);
export const vision = writable<object[]>([]);
export const dreams = writable<object[]>([]);
export const wishlist = writable<object[]>([]);
export const books = writable<object[]>([]);
export const proudBoard = writable<object[]>([]);
export const friends = writable<object[]>([]);

let unsubscribeDocs: Unsubscribe;

// Get logged user data from Firestore
onAuthStateChanged(auth, async (currentUser) => {
	if (currentUser) {
		// Get user docs and listen to changes
		const q = query(collection(db, 'users'), where('uid', '==', currentUser.uid));
		unsubscribeDocs = onSnapshot(q, (querySnapshot) => {
			const docsArray: DocumentData[] = [];
			const goalsData: [][] = [];
			const seedsData: [][] = [];
			const visionData: [][] = [];
			const dreamsData: [][] = [];
			const wishlistData: [][] = [];
			const booksData: [][] = [];
			const proudBoardData: [][] = [];
			const friendsData: [][] = [];

			// Get array of user documents
			querySnapshot.forEach((doc) => {
				docsArray.push(doc.data());
			});

			docsArray.forEach((doc) => {
				// Save subscription info from master document
				if (doc.subscription) subscription.set(doc.subscription);
				// Extract app data
				if (doc.goals) goalsData.push(doc.goals);
				if (doc.seeds) seedsData.push(doc.seeds);
				if (doc.vision) visionData.push(doc.vision);
				if (doc.dreams) dreamsData.push(doc.dreams);
				if (doc.wishlist) wishlistData.push(doc.wishlist);
				if (doc.books) booksData.push(doc.books);
				if (doc.proudBoard) proudBoardData.push(doc.proudBoard);
				if (doc.friends) friendsData.push(doc.friends);
			});

			// Save data in separate stores
			for (let i = 0; i < docsArray.length; i++) {
				if (goalsData[i].length > 0) {
					goals.set(goalsData[i]);
				}
				if (seedsData[i].length > 0) {
					seeds.update((prev) => [...prev, ...seedsData[i]]);
				}
				if (visionData[i].length > 0) {
					vision.update((prev) => [...prev, ...visionData[i]]);
				}
				if (dreamsData[i].length > 0) {
					dreams.update((prev) => [...prev, ...dreamsData[i]]);
				}
				if (wishlistData[i].length > 0) {
					wishlist.update((prev) => [...prev, ...wishlistData[i]]);
				}
				if (booksData[i].length > 0) {
					books.update((prev) => [...prev, ...booksData[i]]);
				}
				if (proudBoardData[i].length > 0) {
					proudBoard.update((prev) => [...prev, ...proudBoardData[i]]);
				}
				if (friendsData[i].length > 0) {
					friends.update((prev) => [...prev, ...friendsData[i]]);
				}
			}
		});
	} else {
		accountData.set(undefined);
		unsubscribeDocs();
	}
});
