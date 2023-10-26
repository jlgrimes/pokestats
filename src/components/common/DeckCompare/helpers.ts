import { DeckTypeSchema } from '../../../hooks/deckArchetypes';

export const getDeckHref = (deck: DeckTypeSchema) => ({
  pathname:
  `/decks/${deck.id}`
});

export const getDeckLink = (deck: DeckTypeSchema) => {
  const { pathname } = getDeckHref(deck);
  return pathname;
};
