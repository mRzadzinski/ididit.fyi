import { seedsData } from '$lib/stores/dbStores';
import { uniqBy } from 'lodash';
import { get } from 'svelte/store';

export interface DailyReview {
	seeds: SeedType[][];
}

export async function getReview() {
	const review: DailyReview = { seeds: [] };

	review.seeds = getReviewSeeds();

	return review;
}

function getReviewSeeds() {
	const data = get(seedsData);
	const reviewData = [];

	// Scan all decks
	for (let i = 0; i < data.decks.length; i++) {
		const seeds = data.decks[i].seeds;
		let reviewSeeds: SeedType[] = [];
		let limit = data.decks[i].dailyLimit;

		// Constrain limit to seeds length
		if (limit > seeds.length) {
			limit = seeds.length;
		}

		// Get limit number of random, unique seeds
		while (reviewSeeds.length < limit) {
			const randomIndex = Math.floor(Math.random() * seeds.length);
			reviewSeeds.push(seeds[randomIndex]);
			reviewSeeds = uniqBy(reviewSeeds, (seed: SeedType) => seed.id);
		}
		reviewData.push(reviewSeeds);
	}
	return reviewData;
}
