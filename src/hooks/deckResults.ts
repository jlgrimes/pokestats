import { useQuery } from '@tanstack/react-query';
import { Deck, Tournament } from '../../types/tournament';
import supabase from '../lib/supabase/client';
import { DeckTypeSchema } from './deckArchetypes';

interface FetchDeckResultsOptions {
  archetype?: number;
  supertype?: {
    id: number;
    format?: number;
  };
}

export const getDeckResultsFilters = (
  deck: Deck,
  format: number | undefined
) => {
  if (deck.classification === 'supertype') {
    if (format) {
      return {
        supertype: {
          id: deck.id,
          format: format,
        },
      };
    }

    return {
      supertype: {
        id: deck.id,
      },
    };
  }

  return {
    archetype: deck.id,
  };
};

export const fetchDeckResults = async (
  options: FetchDeckResultsOptions
): Promise<DeckTypeSchema[]> => {
  let query = supabase
    .from('Deck Results')
    .select('opponent_deck(id,name,defined_pokemon), result, deck_archetype');

  if (options.archetype) {
    query = query.eq('deck_archetype', options.archetype);
  }

  if (options.supertype) {
    query = query.eq('deck_supertype', options.supertype.id);

    if (options.supertype.format) {
      query = query.eq('format', options.supertype.format);
    }
  }

  const res = await query.returns<
    {
      opponent_deck: {
        id: number;
        name: string;
        defined_pokemon: string[];
      };
      result: string;
      deck_archetype: number;
    }[]
  >();

  return (
    res.data?.map(row => ({
      type: options.supertype ? 'supertype' : 'archetype',
      id: row.opponent_deck.id,
      name: row.opponent_deck.name,
      defined_pokemon: row.opponent_deck.defined_pokemon,
      data: {
        result: row.result,
      },
    })) ?? []
  );
};

export const useDeckResults = (options: FetchDeckResultsOptions) => {
  const { data, ...rest } = useQuery({
    queryKey: ['deck-results', options],
    queryFn: () => fetchDeckResults(options),
  });

  const collapsedDecks = data
    ? data.reduce(
        (
          acc: Record<
            number,
            {
              wins: number;
              ties: number;
              count: number;
              deck: curr;
            }
          >,
          curr: DeckTypeSchema
        ) => {
          if (!acc[curr.id]) {
            return {
              ...acc,
              [curr.id]: {
                wins: curr.data?.result === 'W' ? 1 : 0,
                ties: curr.data?.result === 'T' ? 1 : 0,
                count: 1,
                deck: {
                  id: curr.id,
                  name: curr.name,
                  defined_pokemon: curr.defined_pokemon,
                },
              },
            };
          }

          return {
            ...acc,
            [curr.id]: {
              ...acc[curr.id],
              wins: acc[curr.id].wins + (curr.data?.result === 'W' ? 1 : 0),
              ties: acc[curr.id].ties + (curr.data?.result === 'T' ? 1 : 0),
              count: acc[curr.id].count + 1,
            },
          };
        },
        {}
      )
    : [];

  return {
    data: Object.values(collapsedDecks).map(({ wins, ties, count, deck }) => {
      return {
        ...deck,
        count,
        data: {
          wins,
          ties,
        },
      };
    }),
    ...rest,
  };
};
