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

	interface DocsInfo {
		remainingSpace: number;
		doc: object;
		docID: string;
	}

	interface SeedsDeckType {
		id: string;
		name: string;
		dailyLimit: number;
		order: number;
	}

	interface Seeds {
		decks: SeedsDeckType[];
		seeds: object[];
	}
}

export {};
