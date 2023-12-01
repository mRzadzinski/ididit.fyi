import { decksOrderByOptions } from "../../routes/app/seeds/decksLogic";

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
			decksOrderBy: decksOrderByOptions[0],
			// seedsOrderBy: '',
		},
		seedsData: {
			decks: [],
			seeds: []
		} as Seeds
	};
};

export const userDataDocFactory = (uid: string) => {
	return {
		uid,
		seedsData: {
			decks: [],
			seeds: []
		} as Seeds
	};
};
