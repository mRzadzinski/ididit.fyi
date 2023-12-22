import type { Timestamp } from 'firebase/firestore';
import type { DocumentData } from 'firebase/firestore';

declare global {
	interface UserDoc {
		remainingSpace: number;
		doc: DocumentData;
		docID: string;
	}

	interface SeedType {
		id: string;
		date: Timestamp;
		content: string;
		author: string;
		source: string;
		showEveryday: boolean;
	}

	interface DeckType {
		id: string;
		name: string;
		dailyLimit: number;
		order: number;
		seeds: SeedType[];
	}

	interface Subscription {
		status: boolean;
		counters: {
			img: number;
			goals: number;
			seeds: number;
			vision: number;
			dreams: number;
			wishlist: number;
			books: number;
		};
	}

	interface Settings {
		decksOrderBy: string;
		seedsOrderBy: string;
	}

	interface SortDndData {
		id: string;
		data: number | string;
	}
}
export { SeedType, DeckType as SeedsDeckType };
