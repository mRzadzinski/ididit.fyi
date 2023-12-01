import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	// url format: DeckName_Seeds_id
	const id = params.deck_id.split('_')[2];

	return { deckId: id };
};

export interface DeckId {
	deckId: string;
}
