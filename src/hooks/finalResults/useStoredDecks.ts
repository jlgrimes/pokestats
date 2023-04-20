import { useQuery } from '@tanstack/react-query';
import {
  DeckTypeSchema,
  useArchetypes,
  useSupertypes,
} from '../deckArchetypes';
import { fetchDecksWithLists } from './fetch';
import { getDeckCounts } from './helpers';

export const useStoredDecks = (options?: {
  tournamentRange?: number[];
  shouldDrillDown?: boolean;
}): {
  isLoading: boolean;
  data: {
    deck: DeckTypeSchema;
    count: number;
  }[];
  numberReported: number;
} => {
  const { data: decks, isLoading } = useQuery({
    queryKey: ['decks-with-lists', options],
    queryFn: () => fetchDecksWithLists(options?.tournamentRange),
  });

  if (!decks)
    return {
      data: [],
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
          };
        }

        if (deckId.includes('supertype')) {
          const realId = deckId.replace('supertype', '');
          const supertype = decks?.find(({ deck_supertype }) => {
            return deck_supertype?.id && parseInt(realId) === deck_supertype.id;
          })?.deck_supertype;

          return {
            deck: {
              ...supertype,
              type: 'supertype',
            },
            count,
          };
        }

        const realId = deckId.replace('archetype', '');
        const deck = decks?.find(({ deck_archetype }) => {
          return deck_archetype?.id && parseInt(realId) === deck_archetype.id;
        });

        return {
          deck: {
            ...(deck?.deck_archetype ?? {}),
            supertype: deck?.deck_supertype,
            type: 'archetype',
          },
          count,
        };
      })
      .sort((a, b) => {
        if (a.count < b.count) return 1;
        if (b.count < a.count) return -1;
        return 0;
      });
    return {
      isLoading,
      data: ret.filter(({ deck }) => deck.id !== 'unreported'),
      numberReported: decks.filter(deck => deck.deck_archetype).length,
    };
  }

  return {
    data: [],
    isLoading,
    numberReported: 0,
  };
};
