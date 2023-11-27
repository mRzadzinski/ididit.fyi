import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	return { deckId: params.deck_id };
};

export interface DeckId{
    deckId: string
}