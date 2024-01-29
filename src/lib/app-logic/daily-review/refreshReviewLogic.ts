import { db } from '$lib/firebase/firebase';
import { seedsData, syncInProgress, userDocs } from '$lib/stores/dbStores';
import { collection, deleteField, doc, writeBatch } from 'firebase/firestore';
import { cloneDeep, isEqual, uniq } from 'lodash';
import { get } from 'svelte/store';
import type { DailyReviewDB } from './reviewLogic';
import sizeof from 'firestore-size';
import { createNewDataDoc } from '../commonLogic';

export async function refreshReview() {
	const batch = writeBatch(db);
	const usrDocs = get(userDocs);

	for (let i = 0; i < usrDocs.length; i++) {
		if (usrDocs[i].doc.dailyReview) {
			const oldReview = usrDocs[i].doc.dailyReview;
			let newReview = cloneDeep(oldReview);
			let docID = usrDocs[i].docID;
			let docRef = doc(db, 'users', docID);

			newReview = clearRemovedElements(newReview);
			newReview = updateReviewLimits(newReview);
			newReview = adjustReviewsCount(newReview);

			// If anything changed, push to db
			const oldReviewSize = sizeof(oldReview);
			const newReviewSize = sizeof(newReview);
			if (!isEqual(newReview, oldReview)) {
				// Manage remaining space in doc
				if (
					newReviewSize > oldReviewSize &&
					usrDocs[i].remainingSpace + oldReviewSize - newReviewSize < 0
				) {
					// Remove from parent doc
					batch.update(docRef, { dailyReview: deleteField() });

					// Check if remaining docs can fit review
					let reviewSaved = false;
					for (let j = i + 1; j < usrDocs.length; j++) {
						if (usrDocs[j].remainingSpace - newReviewSize > 0) {
							docID = usrDocs[j].docID;
							docRef = doc(db, 'users', docID);

							batch.update(docRef, { dailyReview: newReview });
							reviewSaved = true;
						}
					}

					// If there was no space in docs, create new one and add review
					if (!reviewSaved) {
						const docObj = createNewDataDoc();
						if (docObj) {
							docObj.dailyReview = newReview;
						}

						const newDocRef = doc(collection(db, 'users'));
						batch.set(newDocRef, docObj);
					}
				} else {
					batch.update(docRef, { dailyReview: newReview });
				}
			}
			syncInProgress.set(true);
			await batch.commit();
			syncInProgress.set(false);

			return;
		}
	}
}

function clearRemovedElements(review: DailyReviewDB) {
	review = clearRemovedDecksAndSeeds(review);

	return review;
}

function clearRemovedDecksAndSeeds(review: DailyReviewDB) {
	const appData = get(seedsData);

	for (let i = 0; i < review.decks.length; i++) {
		const reviewDeck = review.decks[i];
		const seeds = review.decks[i].seeds;
		const reviewed = review.decks[i].reviewed;
		const appDeck = appData.decks.filter((deck) => deck.id === reviewDeck.id)[0];

		if (appDeck) {
			// Clear nonexistent seeds
			for (let j = 0; j < seeds.length; j++) {
				const filtered = appDeck.seeds.filter((sd) => sd.id === seeds[j]);
				const seedExists = filtered.length > 0 ? true : false;
				if (!seedExists) {
					seeds.splice(j, 1);
				}
			}
			// Clear nonexistent reviewed seeds
			for (let j = 0; j < reviewed.length; j++) {
				const filtered = appDeck.seeds.filter((sd) => sd.id === reviewed[j]);
				const seedExists = filtered.length > 0 ? true : false;
				if (!seedExists) {
					reviewed.splice(j, 1);
				}
			}
		} else {
			review.decks.splice(i, 1);
		}
	}
	return review;
}

function updateReviewLimits(review: DailyReviewDB) {
	review = updateReviewDeckLimits(review);

	return review;
}

function updateReviewDeckLimits(review: DailyReviewDB) {
	const appData = get(seedsData);

	for (let i = 0; i < review.decks.length; i++) {
		const reviewDeck = review.decks[i];
		const appDeck = appData.decks.filter((deck) => deck.id === reviewDeck.id)[0];

		if (appDeck.dailyLimit !== reviewDeck.dailyLimit) {
			reviewDeck.dailyLimit = appDeck.dailyLimit;
		}
	}
	return review;
}

function adjustReviewsCount(review: DailyReviewDB) {
	review = adjustDeckReviewsCount(review);

	return review;
}

function adjustDeckReviewsCount(review: DailyReviewDB) {
	const appData = get(seedsData);

	// Add missing decks
	for (let i = 0; i < appData.decks.length; i++) {
		const deck = appData.decks[i];
		if (!review.decks.find((dk) => dk.id === deck.id)) {
			review.decks.push({ ...deck, seeds: [], reviewed: [], reviewedCount: 0 });
		}
	}

	// Add / remove seeds
	for (let i = 0; i < review.decks.length; i++) {
		const reviewDeck = review.decks[i];
		const appDeck = appData.decks.filter((deck) => deck.id === reviewDeck.id)[0];
		const limit = reviewDeck.dailyLimit;
		const reviewedCount = reviewDeck.reviewedCount;
		const everydaySeeds: string[] = [];

		// Filter available seeds (exclude reviewed and already in review)
		let seedsPool: SeedType[] | string[] = appDeck.seeds.filter((seed) => {
			for (let j = 0; j < reviewDeck.reviewed.length; j++) {
				if (reviewDeck.reviewed[j] === seed.id) {
					return false;
				}
			}
			for (let j = 0; j < reviewDeck.seeds.length; j++) {
				if (reviewDeck.seeds[j] === seed.id) {
					return false;
				}
			}
			return true;
		});

		// Add missing everyday seeds from the pool
		const missingEveryday = seedsPool.filter((seed) => seed.showEveryday).map((seed) => seed.id);
		reviewDeck.seeds = reviewDeck.seeds.concat(missingEveryday);

		// Remove everyday seeds from the pool
		seedsPool = seedsPool.filter((seed) => !seed.showEveryday);
		// Convert pool to array of IDs
		seedsPool = seedsPool.map((seed) => seed.id);

		// Get everyday seeds count in review deck
		for (let j = 0; j < reviewDeck.seeds.length; j++) {
			const seedID = reviewDeck.seeds[j];
			const isEveryday = appDeck.seeds.find((seed) => seed.id === seedID && seed.showEveryday);
			if (isEveryday) {
				everydaySeeds.push(seedID);
			}
		}

		// Calculate deck limit
		const inReviewCount = reviewDeck.seeds.length - everydaySeeds.length;
		const missingCount = limit - reviewedCount - inReviewCount;
		let target = limit - reviewedCount;

		// Add missing seeds
		if (missingCount > 0) {
			// Constrain limit
			if (target > inReviewCount + seedsPool.length) {
				target = inReviewCount + seedsPool.length;
			}

			while (reviewDeck.seeds.length - everydaySeeds.length < target) {
				const randomIndex = Math.floor(Math.random() * seedsPool.length);
				reviewDeck.seeds.push(seedsPool[randomIndex]);
				reviewDeck.seeds = uniq(reviewDeck.seeds);
			}
		}

		// Remove seeds above limit
		else if (missingCount < 0) {
			if (target < 0) {
				target = 0;
			}

			while (reviewDeck.seeds.length - everydaySeeds.length > target) {
				const randomIndex = Math.floor(Math.random() * reviewDeck.seeds.length);
				// Don't remove everyday seeds
				if (!everydaySeeds.find((seed) => seed === reviewDeck.seeds[randomIndex])) {
					reviewDeck.seeds.splice(randomIndex, 1);
				}
			}
		}
	}
	return review;
}
