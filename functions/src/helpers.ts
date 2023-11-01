export const userDocFactory = (uid: string) => {
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
		goals: [],
		seeds: [],
		vision: [],
		dreams: [],
		wishlist: [],
		books: [],
		proudBoard: [],
		friends: []
	};
};
