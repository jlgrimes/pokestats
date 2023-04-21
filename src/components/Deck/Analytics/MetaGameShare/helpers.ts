import { Deck } from '../../../../../types/tournament';
import { DeckTypeSchema } from '../../../../hooks/deckArchetypes';

export const getNumberOfDecks = (decks: DeckTypeSchema[]) =>
  decks.reduce((acc, curr) => acc + (curr.count ?? 0), 0);

export const getMetaShare = (deck: DeckTypeSchema, decks: DeckTypeSchema[]) => {
  if (!deck.count) return 0;
  return deck.count / getNumberOfDecks(decks);
};

export const getMetaDiff = (
  deck: DeckTypeSchema,
  decks: DeckTypeSchema[],
  previousDecks: DeckTypeSchema[]
) => {
  const metaShare = getMetaShare(deck, decks);
  if (!metaShare) return null;

  const previousMetaDeck = previousDecks.find(
    previousDeck => previousDeck && previousDeck.id === deck.id
  );

  const previousMetaShare =
    (previousMetaDeck?.count ?? 0) /
    (previousDecks.length > 0 ? getNumberOfDecks(previousDecks) : 1);
  const metaShareDiff =
    previousMetaShare === 0 ? metaShare : metaShare - previousMetaShare;
  return metaShareDiff;
};
