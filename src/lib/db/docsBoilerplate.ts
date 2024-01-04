import type { DailyReviewDB } from '$lib/app-logic/reviewLogic';
import { Timestamp } from 'firebase/firestore';

interface UserMainDocFactory {
	uid: string;
	subscription: Subscription;
	settings: Settings;
	seedsData: {
		decks: DeckType[];
	};
	dailyReview?: DailyReviewDB;
}

interface UserDataDocFactory {
	uid: string;
	seedsData: {
		decks: DeckType[];
	};
	dailyReview?: DailyReviewDB;
}

export const userMainDocFactory = (uid: string) => {
	return {
		uid,
		subscription: {
			status: false,
			counters: {
				img: 0,
				goals: 0,
				seeds: 0,
				vision: 0,
				dreams: 0,
				wishlist: 0,
				books: 0
			}
		},
		settings: {
			decksOrderBy: 'custom',
			seedsOrderBy: 'new-old',
			dailyReviewInfo: {
				done: false,
				nextReset: Timestamp.now()
			}
		},
		seedsData: {
			decks: []
		}
	} as UserMainDocFactory;
};

export const userDataDocFactory = (uid: string) => {
	return {
		uid,
		seedsData: {
			decks: [] as DeckType[]
		}
	} as UserDataDocFactory;
};
