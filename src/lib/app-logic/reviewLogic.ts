import { userDataDocFactory } from '$lib/db/docsBoilerplate';
import { db } from '$lib/firebase/firebase';
import { shuffleArray } from '$lib/helpers';
import { user } from '$lib/stores/authStores';
import { seedsData, syncInProgress, userDocs } from '$lib/stores/dbStores';
import { collection, deleteField, doc, updateDoc, writeBatch } from 'firebase/firestore';
import sizeof from 'firestore-size';
import { uniq } from 'lodash';
import { get } from 'svelte/store';

export interface DailyReviewClient {
	decks: DeckType[];
	current: CurrentReview;
}
export interface DailyReviewDB {
	decks: ReviewDeckType[];
	current: CurrentReview;
}
export interface ReviewDeckType extends Omit<DeckType, 'seeds'> {
	seeds: string[];
}
export interface CurrentSeed {
	type: 'seed';
	deckIndex: number;
	seedIndex: number;
}
export type CurrentReview = CurrentSeed;

export async function getReview() {
	const review: DailyReviewDB = {
		decks: [],
		current: { type: 'seed', deckIndex: 0, seedIndex: 0 }
	};

	review.decks = getReviewSeeds();

	pushNewReviewToDB(review);
}

function getReviewSeeds() {
	const data = get(seedsData);
	const reviewData = [];

	// Scan all decks
	for (let i = 0; i < data.decks.length; i++) {
		const deck = data.decks[i];
		const seeds = deck.seeds;
		let reviewSeeds: string[] = [];
		let limit = data.decks[i].dailyLimit;

		// Constrain limit to seeds length
		if (limit > seeds.length) {
			limit = seeds.length;
		}

		// Get all showEveryday seeds
		for (let j = 0; j < deck.seeds.length; j++) {
			if (deck.seeds[j].showEveryday) {
				reviewSeeds.push(deck.seeds[j].id);
			}
		}

		// Get limit number of random, unique seeds
		while (reviewSeeds.length < limit) {
			const randomIndex = Math.floor(Math.random() * seeds.length);
			reviewSeeds.push(seeds[randomIndex].id);
			reviewSeeds = uniq(reviewSeeds);
		}
		// Shuffle seeds
		shuffleArray(reviewSeeds);
		reviewData.push({ ...deck, seeds: reviewSeeds });
	}
	return reviewData;
}

async function pushNewReviewToDB(review: DailyReviewDB) {
	const batch = writeBatch(db);
	const usrDocs = get(userDocs);
	let reviewCreated = false;

	// Scan all docs to
	// remove previous review and add new
	for (let i = 0; i < usrDocs.length; i++) {
		const document = usrDocs[i];
		const documentId = document.docID;
		const docRef = doc(db, 'users', documentId);

		// Remove previous
		if (usrDocs[i].doc.dailyReview) {
			batch.update(docRef, { dailyReview: deleteField() });
		}

		// Add if there's enough space in doc
		const spaceLeft = document.remainingSpace - sizeof(review);
		if (spaceLeft > 0) {
			batch.update(docRef, { dailyReview: review });
			reviewCreated = true;
		}
	}
	// If there was no space in docs, create new one and add review
	if (!reviewCreated) {
		let docObj;
		const usr = get(user);
		if (usr && typeof usr === 'object') {
			docObj = userDataDocFactory(usr.uid);
			docObj.dailyReview = review;
		}

		const docRef = doc(collection(db, 'users'));
		batch.set(docRef, docObj);
	}

	syncInProgress.set(true);
	await batch.commit();
	syncInProgress.set(false);
}

export async function updateCurrentReview(currentReview: CurrentReview) {
	const usrDocs = get(userDocs);
	console.log(currentReview);

	for (let i = 0; i < usrDocs.length; i++) {
		if (usrDocs[i].doc.dailyReview) {
			const docID = usrDocs[i].docID;
			const docRef = doc(db, 'users', docID);

			syncInProgress.set(true);
			await updateDoc(docRef, { 'dailyReview.current': currentReview });
			syncInProgress.set(false);
		}
	}
}
