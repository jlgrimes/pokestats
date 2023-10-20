import { DeckTypeSchema } from '../../../hooks/deckArchetypes';

export const getDeckHref = (deck: DeckTypeSchema) => ({
  pathname:
    deck.type === 'supertype'
      ? `/decks/${deck.id}`
      : `/decks/${
          deck.supertype?.id && deck.supertype.id > 0
            ? deck.supertype.id
            : 'other'
        }/${deck.id}`
});

export const getDeckLink = (deck: DeckTypeSchema) => {
  const { pathname } = getDeckHref(deck);
  return pathname;
};
