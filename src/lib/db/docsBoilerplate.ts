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
			decksOrderBy: 'Custom'
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
