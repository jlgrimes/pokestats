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
} => {
  const { data: archetypes } = useArchetypes();
  const { data: supertypes } = useSupertypes();

  const { data: decks, isLoading } = useQuery({
    queryKey: ['decks-with-lists', options],
    queryFn: () => fetchDecksWithLists(options?.tournamentRange),
  });

  if (!decks || !archetypes)
    return {
      data: [],
      isLoading,
    };

  const deckCounts = getDeckCounts(decks, options?.shouldDrillDown);

  if (deckCounts) {
    const ret = Object.entries(deckCounts ?? {})
      ?.map(([deckId, count]) => {
        if (deckId.includes('supertype')) {
          const realId = deckId.replace('supertype', '');

          return {
            deck: supertypes?.find(({ id }) => {
              return parseInt(realId) === id;
            }) as DeckTypeSchema,
            count,
          };
        }

        const realId = deckId.replace('archetype', '');

        return {
          deck: archetypes?.find(({ id }) => {
            return parseInt(realId) === id;
          }) as DeckTypeSchema,
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
      data: ret,
    };
  }

  return {
    data: [],
    isLoading,
  };
};
