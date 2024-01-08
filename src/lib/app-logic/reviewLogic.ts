import { userDataDocFactory } from '$lib/db/docsBoilerplate';
import { db } from '$lib/firebase/firebase';
import { shuffleArray } from '$lib/helpers';
import { user } from '$lib/stores/authStores';
import { seedsData, syncInProgress, userDocs } from '$lib/stores/dbStores';
import { collection, deleteField, doc, updateDoc, writeBatch } from 'firebase/firestore';
import sizeof from 'firestore-size';
import { cloneDeep, isEqual, uniq } from 'lodash';
import { get } from 'svelte/store';
import { DateTime } from 'luxon';

export interface DailyReviewClient {
	decks: DeckType[];
}
export interface DailyReviewDB {
	decks: ReviewDeckType[];
}
export interface ReviewDeckType extends Omit<DeckType, 'seeds'> {
	seeds: string[];
	reviewed: string[];
	reviewedCount: number;
}

export async function getReview() {
	const review: DailyReviewDB = {
		decks: []
	};

	review.decks = getReviewSeeds();

	await pushNewReviewToDB(review);
	await setReviewDoneStatus(false);
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

		// Get all showEveryday seeds
		for (let j = 0; j < deck.seeds.length; j++) {
			if (deck.seeds[j].showEveryday) {
				reviewSeeds.push(deck.seeds[j].id);
			}
		}
		const everydaySeedsCount = reviewSeeds.length;

		// Constrain deck's limit to seeds length, excluding everyday seeds
		if (limit > seeds.length - everydaySeedsCount) {
			limit = seeds.length - everydaySeedsCount;
		}

		// Get limit number of random, unique seeds, excluding everyday seeds
		while (reviewSeeds.length - everydaySeedsCount < limit) {
			const randomIndex = Math.floor(Math.random() * seeds.length);
			reviewSeeds.push(seeds[randomIndex].id);
			reviewSeeds = uniq(reviewSeeds);
		}
		// Shuffle seeds
		shuffleArray(reviewSeeds);
		reviewData.push({ ...deck, seeds: reviewSeeds, reviewed: [], reviewedCount: 0 });
	}
	shuffleArray(reviewData);
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

export async function reviewNext() {
	const usrDocs = get(userDocs);
	const appData = get(seedsData);

	for (let i = 0; i < usrDocs.length; i++) {
		if (usrDocs[i].doc.dailyReview) {
			const review = cloneDeep(usrDocs[i].doc.dailyReview);
			const docID = usrDocs[i].docID;
			const docRef = doc(db, 'users', docID);

			for (let i = 0; i < review.decks.length; i++) {
				const reviewDeck = review.decks[i];
				const appDeck = appData.decks.filter((deck) => deck.id === reviewDeck.id)[0];

				if (review.decks[i].seeds.length > 0) {
					// Move first seed to reviewed
					const reviewedSeed = review.decks[i].seeds.splice(0, 1)[0];
					review.decks[i].reviewed.push(reviewedSeed);

					// If it's not everyday seed, increase reviewCount
					if (appDeck.seeds.find((seed) => seed.id === reviewedSeed && !seed.showEveryday)) {
						review.decks[i].reviewedCount++;
					}
					break;
				}
			}

			syncInProgress.set(true);
			await updateDoc(docRef, { dailyReview: review });
			syncInProgress.set(false);

			return;
		}
	}
}

export async function setReviewDoneStatus(bool: boolean) {
	const batch = writeBatch(db);
	const docRef = doc(db, 'users', getSettingsDocID());

	// Update reset date only when creating new review
	if (!bool) {
		batch.update(docRef, { 'settings.dailyReviewInfo.nextReset': getNextReviewResetDate() });
	}
	batch.update(docRef, { 'settings.dailyReviewInfo.done': bool });

	syncInProgress.set(true);
	await batch.commit();
	syncInProgress.set(false);
}

export async function refreshReview() {
	const usrDocs = get(userDocs);
	for (let i = 0; i < usrDocs.length; i++) {
		if (usrDocs[i].doc.dailyReview) {
			const docID = usrDocs[i].docID;
			const docRef = doc(db, 'users', docID);
			let review = cloneDeep(usrDocs[i].doc.dailyReview);

			review = clearRemovedElements(review);
			review = updateReviewLimits(review);
			review = adjustReviewsCount(review);

			// If anything changed, push to db
			if (!isEqual(review, usrDocs[i].doc.dailyReview)) {
				syncInProgress.set(true);
				await updateDoc(docRef, { dailyReview: review });
				syncInProgress.set(false);
			}
			return;
		}
	}
}

function adjustReviewsCount(review: DailyReviewDB) {
	review = adjustDeckReviewsCount(review);

	return review;
}

function adjustDeckReviewsCount(review: DailyReviewDB) {
	const appData = get(seedsData);

	for (let i = 0; i < review.decks.length; i++) {
		const reviewDeck = review.decks[i];
		const appDeck = appData.decks.filter((deck) => deck.id === reviewDeck.id)[0];
		const limit = reviewDeck.dailyLimit;
		const reviewedCount = reviewDeck.reviewedCount;
		let reviewEverydayCount = 0;

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
			const isEveryday = appDeck.seeds.filter((seed) => seed.id === seedID && seed.showEveryday);
			if (isEveryday.length > 0) {
				reviewEverydayCount++;
			}
		}

		// Add to meet the limit (random seeds, not everyday ones, skip reviewed)
		const inReviewCount = reviewDeck.seeds.length - reviewEverydayCount;
		let currentLimit = limit - reviewedCount - inReviewCount;

		// Constrain limit to amount of available seeds in pool
		if (currentLimit > seedsPool.length) {
			currentLimit = seedsPool.length;
		}

		// Get limit number of random, unique seeds, excluding everyday seeds
		while (reviewDeck.seeds.length - reviewEverydayCount < currentLimit) {
			const randomIndex = Math.floor(Math.random() * seedsPool.length);
			reviewDeck.seeds.push(seedsPool[randomIndex]);
			reviewDeck.seeds = uniq(reviewDeck.seeds);
		}

		// Remove to meet the limit (random seeds, not everyday ones)
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

function clearRemovedElements(review: DailyReviewDB) {
	review = clearRemovedSeeds(review);

	return review;
}

function clearRemovedSeeds(review: DailyReviewDB) {
	// Clear removed seeds from review and reviewed
	const appData = get(seedsData);

	for (let i = 0; i < review.decks.length; i++) {
		const reviewDeck = review.decks[i];
		const seeds = review.decks[i].seeds;
		const reviewed = review.decks[i].reviewed;
		const appDeck = appData.decks.filter((deck) => deck.id === reviewDeck.id)[0];

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
	}
	return review;
}

function getNextReviewResetDate() {
	const now = DateTime.now();
	// Set reset date to 4 am today
	let resetDate = DateTime.local(now.get('year'), now.get('month'), now.get('day'), 4);

	// If it's past 4 am, set reset for next day
	if (now.get('hour') >= 4) {
		resetDate = resetDate.plus({ days: 1 });
	}
	return resetDate.toJSDate();
}

function getSettingsDocID() {
	const usrDocs = get(userDocs);

	for (let i = 0; i < usrDocs.length; i++) {
		if (usrDocs[i].doc.settings) {
			return usrDocs[i].docID;
		}
	}
	return '';
}
