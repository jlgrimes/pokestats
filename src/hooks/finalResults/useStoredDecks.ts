import { useQuery } from '@tanstack/react-query';
import { Deck } from '../../../types/tournament';
import { getConversionRate } from '../stats';
import { DeckTypeSchema } from '../deckArchetypes';
import { fetchDecksWithLists } from './fetch';
import { FinalResultsDeckSchema } from './final-results-schema';
import { getDeckCounts } from './helpers';

export const useStoredDecks = (options?: {
  tournamentId?: string;
  shouldDrillDown?: boolean;
  sortBy?: 'played' | 'day 2';
  sortOrder?: 'asc' | 'desc';
}): {
  isLoading: boolean;
  data: DeckTypeSchema[];
  decks: FinalResultsDeckSchema[];
  numberReported: number;
} => {
  const sortBy = options?.sortBy ?? 'played';
  const sortOrder = options?.sortOrder ?? 'desc';

  const { data: decks, isLoading } = useQuery({
    queryKey: [
      'decks-with-lists',
      options?.tournamentId,
      options?.shouldDrillDown,
    ],
    queryFn: () => fetchDecksWithLists(options?.tournamentId),
  });

  if (!decks)
    return {
      data: [],
      decks: [],
      isLoading,
      numberReported: 0,
    };

  const deckCounts = getDeckCounts(decks, options?.shouldDrillDown);

  if (deckCounts) {
    const ret = Object.entries(deckCounts ?? {})
      ?.map(([deckId, count]) => {
        if (deckId === 'unreported') {
          return {
            deck: {
              id: 'unreported',
              name: 'Unreported',
              defined_pokemon: ['Unown'],
            },
            count,
            day2Conversion: 0,
          };
        }

        if (deckId.includes('supertype')) {
          const realId = deckId.replace('supertype', '');
          const supertype = decks?.find(({ deck_supertype }) => {
            return deck_supertype?.id && parseInt(realId) === deck_supertype.id;
          })?.deck_supertype;

          const deck = {
            ...supertype,
            type: 'supertype',
          };

          return {
            deck,
            count,
            day2Conversion: getConversionRate(deck, decks),
          };
        }

        const realId = deckId.replace('archetype', '');
        const found = decks?.find(({ deck_archetype }) => {
          return deck_archetype?.id && parseInt(realId) === deck_archetype.id;
        });

        const deck = {
          ...(found?.deck_archetype ?? {}),
          supertype: found?.deck_supertype,
          type: 'archetype',
        };

        return {
          deck,
          count,
          day2Conversion: getConversionRate(deck, decks),
        };
      })
      .sort((a, b) => {
        if (a.count <= 20 || a.deck.name === 'Other') return 1;
        if (b.count <= 20 || b.deck.name === 'Other') return -1;

        if (sortBy === 'day 2') {
          if (sortOrder === 'desc') {
            if (a.day2Conversion < b.day2Conversion) return 1;
            if (b.day2Conversion < a.day2Conversion) return -1;
          }

          if (sortOrder === 'asc') {
            if (a.day2Conversion > b.day2Conversion) return 1;
            if (b.day2Conversion > a.day2Conversion) return -1;
          }
        }

        if (sortBy === 'played') {
          if (sortOrder === 'desc') {
            if (a.count < b.count) return 1;
            if (b.count < a.count) return -1;
          }

          if (sortOrder === 'asc') {
            if (a.count > b.count) return 1;
            if (b.count > a.count) return -1;
          }
        }

        return 0;
      });
    return {
      isLoading,
      decks,
      data: ret
        .filter(({ deck }) => deck.id !== 'unreported')
        .map(({ deck, count }) => ({ ...deck, count })),
      numberReported: decks.filter(deck => deck.deck_archetype).length,
    };
  }

  return {
    data: [],
    decks: [],
    isLoading,
    numberReported: 0,
  };
};
