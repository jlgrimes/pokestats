import { Deck, DeckCard } from '../../../types/tournament';
import {
  getCompressedList,
  getSameCardIdx,
} from '../../components/Deck/ListViewer/helpers';
import { useFinalResults } from './useFinalResults';

export const useCardCounts = (
  deck: Deck,
  options?: { countCopies?: boolean }
) => {
  const filters =
    deck.classification === 'supertype'
      ? { supertypeId: deck.id }
      : { deckId: deck.id };

  const { data: deckStandings } = useFinalResults(filters);

  if (!deckStandings) return [];

  const cardCounts = deckStandings?.reduce(
    (acc: { card: DeckCard; count: number }[], deck) => {
      if (deck.deck_list) {
        const compressedList = getCompressedList(deck.deck_list);

        for (const card of compressedList) {
          const sameCardIdx = getSameCardIdx(
            acc.map(({ card }) => card),
            card
          );
          if (sameCardIdx >= 0) {
            acc[sameCardIdx] = {
              ...acc[sameCardIdx],
              count:
                acc[sameCardIdx].count +
                (options?.countCopies ? card.count : 1),
            };
          } else {
            acc.push({
              card,
              count: options?.countCopies ? card.count : 1,
            });
          }
        }
      }

      return acc;
    },
    []
  );

  const cardCountsSorted = cardCounts.sort((a, b) => {
    if (a.count > b.count) return -1;
    if (b.count < a.count) return 1;
    return 0;
  });

  return cardCountsSorted;
};
