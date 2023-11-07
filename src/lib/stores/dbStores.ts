import { auth, db } from '$lib/firebase/firebase';
import { collection, onSnapshot, query, type DocumentData, where } from 'firebase/firestore';
import { get, writable } from 'svelte/store';
import { onAuthStateChanged, type Unsubscribe } from 'firebase/auth';
import { isEqual } from 'lodash';
import sizeof from 'firestore-size';

interface DocsInfo {
	remainingSpace: number;
	doc: object;
	docID: string;
}

export interface SeedsDeckType {
	id: string;
	name: string;
	dailyLimit: number;
	order: number;
}

export interface Seeds {
	decks: SeedsDeckType[];
	seeds: object[];
}

export const userDocs = writable<DocumentData[]>([]);
export const subscription = writable<object[]>([]);
// export const goalsData = writable<object[]>([]);
export const seedsData = writable<Seeds>({
	decks: [],
	seeds: []
});
// export const vision = writable<object[]>([]);
// export const dreams = writable<object[]>([]);
// export const wishlist = writable<object[]>([]);
// export const books = writable<object[]>([]);
// export const proudBoard = writable<object[]>([]);
// export const friends = writable<object[]>([]);

export let unsubscribeDocs: Unsubscribe;

// Get logged user data from Firestore
onAuthStateChanged(auth, async (currentUser) => {
	if (currentUser) {
		// Get user docs and listen to changes
		const q = query(collection(db, 'users'), where('uid', '==', currentUser.uid));
		unsubscribeDocs = onSnapshot(q, (querySnapshot) => {
			const docsArray: DocumentData[] = [];
			const docsInfo: DocsInfo[] = [];
			// let goalsData: object[] = [];
			const allSeeds: Seeds = { decks: [], seeds: [] };
			// let visionData: object[] = [];
			// let dreamsData: object[] = [];
			// let wishlistData: object[] = [];
			// let booksData: object[] = [];
			// let proudBoardData: object[] = [];
			// let friendsData: object[] = [];

			// Get array of user documents
			querySnapshot.forEach((doc) => {
				docsArray.push(doc.data());
				docsInfo.push({
					remainingSpace: 1000000 - sizeof(doc.data()),
					doc: doc.data(),
					docID: doc.id
				});
			});

			docsInfo.sort((prev, next) => {
				return prev.remainingSpace - next.remainingSpace;
			});
			// Save documents data in store for comparison and size info
			userDocs.set(docsInfo);

			docsArray.forEach((doc) => {
				// Save subscription info from master document
				if (doc.subscription) {
					if (!isEqual(get(subscription), doc.subscription)) {
						subscription.set(doc.subscription);
					}
				}
				// Extract app data
				// goalsData = [...goalsData, ...doc.goals];
				allSeeds.decks = allSeeds.decks.concat(doc.seedsData.decks);
				allSeeds.seeds = allSeeds.seeds.concat(doc.seedsData.seeds);
				// visionData = [...visionData, ...doc.vision];
				// dreamsData = [...dreamsData, ...doc.dreams];
				// wishlistData = [...wishlistData, ...doc.wishlist];
				// booksData = [...booksData, ...doc.books];
				// proudBoardData = [...proudBoardData, ...doc.proudBoard];
				// friendsData = [...friendsData, ...doc.friends];
			});

			// Compare with current data and update
			// if (!isEqual(get(goals), goalsData)) goals.set(goalsData);
			if (!isEqual(get(seedsData), allSeeds)) seedsData.set(allSeeds);
			// if (!isEqual(get(vision), visionData)) vision.set(visionData);
			// if (!isEqual(get(dreams), dreamsData)) dreams.set(dreamsData);
			// if (!isEqual(get(wishlist), wishlistData)) wishlist.set(wishlistData);
			// if (!isEqual(get(books), booksData)) books.set(booksData);
			// if (!isEqual(get(proudBoard), proudBoardData)) proudBoard.set(proudBoardData);
			// if (!isEqual(get(friends), friendsData)) friends.set(friendsData);
		});
	}
});

export function clearAppData() {
	unsubscribeDocs();
	subscription.set([]);
	// goals.set([]);
	seedsData.set({ decks: [], seeds: [] });
	// vision.set([]);
	// dreams.set([]);
	// wishlist.set([]);
	// books.set([]);
	// proudBoard.set([]);
	// friends.set([]);
}
