import { Deck, DeckCard } from '../../../types/tournament';
import {
  getCompressedList,
  getSameCardIdx,
} from '../../components/Deck/ListViewer/helpers';
import { useDeckStandings } from '../newStandings';

export const getFinalResultsDeckFilters = (deck: Deck, format?: number) => {
  const filters: Record<string, any> = {};

  if (deck.classification === 'supertype') filters.supertypeId = deck.id;
  if (deck.classification === 'archetype') filters.deckId = deck.id;
  if (format) filters.format = format;

  return filters;
};

export const useCardCounts = (
  deck: Deck,
  format: number | undefined,
  options?: { countCopies?: boolean }
) => {
  const { data: deckStandings } = useDeckStandings(deck);

  if (!deckStandings) return [];

  const cardCounts = deckStandings?.reduce(
    (acc: { card: DeckCard; count: number }[], deck) => {
      if (deck.decklist) {
        const compressedList = getCompressedList(deck.decklist);

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
