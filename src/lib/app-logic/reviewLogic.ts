import { db } from '$lib/firebase/firebase';
import { seedsData, userDocs } from '$lib/stores/dbStores';
import { writeBatch } from 'firebase/firestore';
import sizeof from 'firestore-size';
import { uniq, uniqBy } from 'lodash';
import { get } from 'svelte/store';

export interface DailyReview {
	decks: DeckType[];
	current: CurrentReview;
}
export type CurrentReview = CurrentSeed;
export interface CurrentSeed {
	type: 'seed';
	deckIndex: number;
	seedIndex: number;
}

export function getReview() {
	const review: DailyReview = { decks: [], current: { type: 'seed', deckIndex: 0, seedIndex: 0 } };

	review.decks = getReviewSeeds();

	return review;
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

		// Get limit number of random, unique seeds
		while (reviewSeeds.length < limit) {
			const randomIndex = Math.floor(Math.random() * seeds.length);
			reviewSeeds.push(seeds[randomIndex].id);
			reviewSeeds = uniq(reviewSeeds);
		}
		reviewData.push({ ...deck, seeds: reviewSeeds });
	}
	return reviewData;
}

// async function pushNewReviewToDB(review:DailyReview) {
// 	const batch = writeBatch(db);
// 	const usrDocs = get(userDocs);
// 	const spaceRemaining = sizeof(usrDocs) - sizeof(review);

// 	// Add to dedicated dailyReview doc
// 	// If too large split review data in half until it fits into separate documents
// }

// Keep only deck name with seed IDs and scan all data on each change
