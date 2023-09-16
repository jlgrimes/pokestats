import { DeckTypeSchema } from '../../../hooks/deckArchetypes';

export const getDeckHref = (deck: DeckTypeSchema, format?: number) => ({
  pathname:
    deck.type === 'supertype'
      ? `/decks/${deck.id}`
      : `/decks/${
          deck.supertype?.id && deck.supertype.id > 0
            ? deck.supertype.id
            : 'other'
        }/${deck.id}`,
  query: {
    ...(format ? { format } : {}),
  },
});

export const getDeckLink = (deck: DeckTypeSchema, format?: number) => {
  const { pathname, query } = getDeckHref(deck, format);

  if (query.format) {
    return `${pathname}?format=${query.format}`;
  }

  return pathname;
};
