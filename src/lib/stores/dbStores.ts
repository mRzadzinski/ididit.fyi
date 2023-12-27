import { auth, db } from '$lib/firebase/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { derived, get, writable } from 'svelte/store';
import { onAuthStateChanged, type Unsubscribe } from 'firebase/auth';
import sizeof from 'firestore-size';
import type { DailyReviewClient, DailyReviewDB } from '$lib/app-logic/reviewLogic';

// Leave ~15k bytes buffer
export const docSizeLimit = 1033576;
export const syncInProgress = writable<boolean>(false);
export const userDocs = writable<UserDoc[]>([]);
export const settings = writable<Settings>();
export const subscription = derived(userDocs, ($userDocs) => {
	let data: Subscription | undefined;
	for (let i = 0; i < $userDocs.length; i++) {
		if ($userDocs[i].doc.settings) {
			data = $userDocs[i].doc.subscription;
			settings.set($userDocs[i].doc.settings);
		}
	}
	return data;
});
export const seedsData = derived(userDocs, ($userDocs) => {
	const data = {
		decks: [] as DeckType[]
	};
	let decks: Array<DeckType | null> = [];

	// Get decks from all docs including their copies
	for (let i = 0; i < $userDocs.length; i++) {
		decks = decks.concat($userDocs[i].doc.seedsData.decks);
	}

	// Concatenate decks with the same IDs
	for (let i = 0; i < decks.length; i++) {
		const deck = decks[i];
		let seedsOne: SeedType[] = [];
		let seedsTwo: SeedType[] = [];

		if (deck) {
			seedsOne = deck.seeds;
		} else {
			continue;
		}

		for (let j = i + 1; j < decks.length; j++) {
			const dck = decks[j];

			if (dck && deck.id === dck.id) {
				seedsTwo = dck.seeds;
				// Set deck to null to skip it in next iterations
				decks[j] = null;
			}
		}
		data.decks.push({ ...deck, seeds: [...seedsOne, ...seedsTwo] });
		decks[i] = null;
	}
	return data;
});

export const dailyReview = derived([userDocs, seedsData], ([$userDocs, $seedsData]) => {
	// Get daily review object from docs
	for (let i = 0; i < $userDocs.length; i++) {
		if ($userDocs[i].doc.dailyReview) {
			const dbData: DailyReviewDB = $userDocs[i].doc.dailyReview;
			const clientData: DailyReviewClient = { current: dbData.current, decks: [] };

			// Get seeds from seedIDs
			// Scan all decks in dailyReviewDB data
			for (let i = 0; i < dbData.decks.length; i++) {
				const dbDeck = dbData.decks[i];
				const seedIDs = dbData.decks[i].seeds;
				const tempDeck = $seedsData.decks.filter((deck) => deck.id === dbDeck.id)[0];
				const deck = { ...tempDeck, seeds: [] as SeedType[] };

				// Scan all seedIDs inside deck
				for (let j = 0; j < seedIDs.length; j++) {
					// Find seed by ID in seedsData
					const seed = tempDeck.seeds.filter((seed) => seed.id === seedIDs[j])[0];
					deck.seeds.push(seed);
				}
				clientData.decks.push(deck);
			}
			return clientData;
		}
	}
	return null;
});

export let unsubscribeDocs: Unsubscribe;

// Get logged user data from Firestore
onAuthStateChanged(auth, async (currentUser) => {
	if (currentUser) {
		// Get user docs and listen to changes
		const q = query(collection(db, 'users'), where('uid', '==', currentUser.uid));
		unsubscribeDocs = onSnapshot(q, (querySnapshot) => {
			let docs: UserDoc[] = get(userDocs);

			// See what changed
			querySnapshot.docChanges().forEach((change) => {
				// Add new docs
				if (change.type === 'added') {
					const newDoc = change.doc;
					docs.push({
						remainingSpace: docSizeLimit - sizeof(newDoc.data()),
						doc: newDoc.data(),
						docID: newDoc.id
					});
					// console.log('New: ', change.doc.id);
				}
				// Modify
				if (change.type === 'modified') {
					const newRemainingSpace = docSizeLimit - sizeof(change.doc.data());
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
					docs = docs.filter((doc) => doc.docID !== change.doc.id);
					// console.log('Removed: ', change.doc.id);
				}
			});

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
	userDocs.set([]);
}
