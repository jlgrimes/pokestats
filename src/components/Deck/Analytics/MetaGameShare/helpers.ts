import { Deck } from '../../../../../types/tournament';
import { DeckTypeSchema } from '../../../../hooks/deckArchetypes';

export const getNumberOfDecks = (
  decks: { count: number; deck: DeckTypeSchema }[]
) => decks.reduce((acc, curr) => acc + (curr.count ?? 0), 0);

export const getMetaShare = (
  deck: DeckTypeSchema,
  decks: { deck?: DeckTypeSchema; count: number }[]
) => {
  const metaDeck = decks.find(
    ({ deck: currDeck }) => currDeck && currDeck.id === deck.id
  );
  if (!metaDeck) return null;

  return metaDeck.count / getNumberOfDecks(decks);
};

export const getMetaDiff = (
  deck: DeckTypeSchema,
  decks: { deck?: DeckTypeSchema; count: number }[],
  previousDecks: { deck: DeckTypeSchema; count: number }[]
) => {
  const metaShare = getMetaShare(deck, decks);
  if (!metaShare) return null;

  const previousMetaDeck = previousDecks.find(
    ({ deck: previousDeck }) => previousDeck && previousDeck.id === deck.id
  );

  const previousMetaShare =
    (previousMetaDeck?.count ?? 0) /
    (previousDecks.length > 0 ? getNumberOfDecks(previousDecks) : 1);
  const metaShareDiff =
    previousMetaShare === 0 ? metaShare : metaShare - previousMetaShare;
  return metaShareDiff;
};
