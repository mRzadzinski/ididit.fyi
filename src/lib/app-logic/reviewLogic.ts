import { userDataDocFactory } from '$lib/db/docsBoilerplate';
import { db } from '$lib/firebase/firebase';
import { shuffleArray } from '$lib/helpers';
import { user } from '$lib/stores/authStores';
import { seedsData, syncInProgress, userDocs } from '$lib/stores/dbStores';
import { collection, deleteField, doc, updateDoc, writeBatch } from 'firebase/firestore';
import sizeof from 'firestore-size';
import { uniq } from 'lodash';
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
		const everydaySeedsCount = reviewSeeds.length;

		// Get limit number of random, unique seeds. Exclude everyday seeds from limit
		while (reviewSeeds.length < limit + everydaySeedsCount) {
			const randomIndex = Math.floor(Math.random() * seeds.length);
			reviewSeeds.push(seeds[randomIndex].id);
			reviewSeeds = uniq(reviewSeeds);
		}
		// Shuffle seeds
		shuffleArray(reviewSeeds);
		reviewData.push({ ...deck, seeds: reviewSeeds });
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

	for (let i = 0; i < usrDocs.length; i++) {
		if (usrDocs[i].doc.dailyReview) {
			const review = usrDocs[i].doc.dailyReview;

			// Remove first seed from deck
			if (review && review.decks && review.decks[0] && review.decks[0].seeds.length > 1) {
				review.decks[0].seeds.splice(0, 1);
			}
			// Remove first deck from review
			else {
				review?.decks.splice(0, 1);
			}

			const docID = usrDocs[i].docID;
			const docRef = doc(db, 'users', docID);

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

export async function refreshReview() {}

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
