import type { DailyReview } from '$lib/app-logic/reviewLogic';

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
			seedsOrderBy: 'new-old'
		},
		seedsData: {
			decks: [] as DeckType[]
		}
	};
};

export const userDataDocFactory = (uid: string) => {
	return {
		uid,
		seedsData: {
			decks: [] as DeckType[]
		}
	};
};

export const DailyReviewDocFactory = (uid: string) => {
	return {
		uid,
		dailyReview: {} as DailyReview
	};
};
