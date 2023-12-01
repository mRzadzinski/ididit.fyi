import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	// url format: DeckName_Seeds_id
	const id = params.deck_id.split('_')[2];
	const name = params.deck_id.split('_')[0];

	return { deckId: id, deckName: name };
};

export interface DeckData {
	deckId: string;
	deckName: string;
}
