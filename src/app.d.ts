import 'unplugin-icons/types/svelte';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	declare namespace svelteHTML {
		interface HTMLAttributes<T> {
			'on:consider'?: (
				event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }
			) => void;
			'on:finalize'?: (
				event: CustomEvent<DndEvent<ItemType>> & { target: EventTarget & T }
			) => void;
		}
	}

	interface UserDoc {
		remainingSpace: number;
		doc: DocumentData;
		docID: string;
	}

	interface Seed {
		id: string;
		content: string;
		author: string;
		source: string;
	}

	interface SeedsDeckType {
		id: string;
		name: string;
		dailyLimit: number;
		order: number;
		seeds: Seed[];
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

	export interface SortDndData {
		id: string;
		data: number | string;
	}
}

export {};
