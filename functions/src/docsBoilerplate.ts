import { Timestamp } from 'firebase-admin/firestore';

interface SeedType {
	id: string;
	date: Timestamp;
	content: string;
	author: string;
	source: string;
	showEveryday: boolean;
}

export interface SeedsDeckType {
	id: string;
	name: string;
	dailyLimit: number;
	order: number;
	seeds: SeedType[];
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
			decks: [] as SeedsDeckType[]
		}
	};
};

export const userDataDocFactory = (uid: string) => {
	return {
		uid,
		seedsData: {
			decks: [] as SeedsDeckType[]
		}
	};
};
