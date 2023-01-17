import { Deck } from '../../../../../types/tournament';

export const getNumberOfDecks = (decks: { count: number; deck: Deck }[]) =>
  decks.reduce((acc, curr) => acc + (curr.count ?? 0), 0);

export const getMetaShare = (
  deck: Deck,
  decks: { deck: Deck; count: number }[]
) => {
  const metaDeck = decks.find(({ deck: currDeck }) => currDeck.id === deck.id);
  if (!metaDeck) return null;

  return metaDeck.count / getNumberOfDecks(decks);
};

export const getMetaDiff = (
  deck: Deck,
  decks: { deck: Deck; count: number }[],
  previousDecks: { deck: Deck; count: number }[]
) => {
  const metaShare = getMetaShare(deck, decks);
  if (!metaShare) return null;

  const previousMetaDeck = previousDecks.find(
    ({ deck: previousDeck }) => previousDeck.id === deck.id
  );

  const previousMetaShare =
    (previousMetaDeck?.count ?? 0) /
    (previousDecks.length > 0 ? getNumberOfDecks(previousDecks) : 1);
  const metaShareDiff =
    previousMetaShare === 0 ? 1 : metaShare - previousMetaShare;
  return metaShareDiff;
};
