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
		// goalsData: {
		// 	categories: [],
		// 	goals: []
		// },
		seedsData: {
			decks: [],
			seeds: []
		} as Seeds
		// visionData: {},
		// dreamsData: {},
		// wishlistData: {},
		// booksData: {},
		// proudBoardData: {},
		// friendsData: {}
	};
};

export const userDataDocFactory = (uid: string) => {
	return {
		uid,
		// goalsData: {
		// 	categories: [],
		// 	goals: []
		// },
		seedsData: {
			decks: [],
			seeds: []
		} as Seeds
		// visionData: {},
		// dreamsData: {},
		// wishlistData: {},
		// booksData: {},
		// proudBoardData: {},
		// friendsData: {}
	};
};
