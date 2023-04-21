import { useQuery } from '@tanstack/react-query';
import { Deck, Tournament } from '../../types/tournament';
import supabase from '../lib/supabase/client';
import {
  DeckTypeSchema,
  DeckClassification,
  SupertypeSchema,
} from './deckArchetypes';

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
  options: FetchDeckResultsOptions,
  shouldDrilldown: boolean
): Promise<DeckTypeSchema[]> => {
  let query = supabase
    .from('Deck Results')
    .select(
      'opponent_deck(id,name,defined_pokemon,supertype(id,name,defined_pokemon)), result, deck_archetype'
    );

  if (options.archetype) {
    query = query.eq('deck_archetype', options.archetype);
  }

  if (options.supertype) {
    if (!options.supertype.format) return [];

    query = query
      .eq('deck_supertype', options.supertype.id)
      .eq('format', options.supertype.format);
  }

  const res = await query.returns<
    {
      opponent_deck: {
        id: number;
        name: string;
        defined_pokemon: string[];
        supertype: SupertypeSchema;
      };
      result: string;
      deck_archetype: number;
      supertype: number;
    }[]
  >();

  return (
    res.data?.map(row => ({
      type: shouldDrilldown ? 'archetype' : 'supertype',
      id: shouldDrilldown
        ? row.opponent_deck.id
        : row.opponent_deck.supertype?.id ?? row.opponent_deck.id,
      name: shouldDrilldown
        ? row.opponent_deck.name
        : row.opponent_deck.supertype?.name ?? row.opponent_deck.name,
      defined_pokemon: shouldDrilldown
        ? row.opponent_deck.defined_pokemon
        : row.opponent_deck.supertype?.defined_pokemon ??
          row.opponent_deck.defined_pokemon,
      data: {
        result: row.result,
      },
    })) ?? []
  );
};

export const calculateWinPercentage = (deck: DeckTypeSchema) =>
  (deck.data?.wins ?? 0) / ((deck.count ?? 1) - (deck.data?.ties ?? 0));

export const calculateTieRate = (deck: DeckTypeSchema) =>
  (deck.data?.ties ?? 0) / (deck.count ?? 1);

export const useDeckResults = (
  options: FetchDeckResultsOptions,
  shouldDrilldown: boolean,
  sortBy: 'win rate' | 'tie rate',
  sortOrder: 'asc' | 'desc'
) => {
  const { data, ...rest } = useQuery({
    queryKey: ['deck-results', options, shouldDrilldown],
    queryFn: () => fetchDeckResults(options, shouldDrilldown),
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
              deck: {
                type: DeckClassification;
                id: number;
                name: string;
                defined_pokemon: string[];
              };
            }
          >,
          curr: DeckTypeSchema
        ) => {
          const identifier = curr.id;

          if (!acc[identifier]) {
            return {
              ...acc,
              [identifier]: {
                wins: curr.data?.result === 'W' ? 1 : 0,
                ties: curr.data?.result === 'T' ? 1 : 0,
                count: 1,
                deck: {
                  type: curr.type,
                  id: identifier,
                  name: curr.name,
                  defined_pokemon: curr.defined_pokemon,
                },
              },
            };
          }

          return {
            ...acc,
            [identifier]: {
              ...acc[identifier],
              wins: acc[identifier].wins + (curr.data?.result === 'W' ? 1 : 0),
              ties: acc[identifier].ties + (curr.data?.result === 'T' ? 1 : 0),
              count: acc[identifier].count + 1,
            },
          };
        },
        {}
      )
    : [];

  return {
    data: Object.values(collapsedDecks)
      .map(({ wins, ties, count, deck }) => {
        return {
          ...deck,
          count,
          data: {
            wins,
            ties,
          },
        };
      })
      .filter(row => {
        if (options.supertype) return row.id !== options.supertype.id;
        if (options.archetype) return row.id !== options.archetype;

        return true;
      })
      .sort((a, b) => {
        if (a.count <= 10 || a.name === 'Other') return 1;
        if (b.count <= 10 || b.name === 'Other') return -1;

        if (sortBy === 'win rate') {
          if (sortOrder === 'desc') {
            if (calculateWinPercentage(a) < calculateWinPercentage(b)) return 1;
            if (calculateWinPercentage(b) < calculateWinPercentage(a))
              return -1;
          }

          if (sortOrder === 'asc') {
            if (calculateWinPercentage(a) > calculateWinPercentage(b)) return 1;
            if (calculateWinPercentage(b) > calculateWinPercentage(a))
              return -1;
          }
        }

        if (sortBy === 'tie rate') {
          if (sortOrder === 'desc') {
            if (calculateTieRate(a) < calculateTieRate(b)) return 1;
            if (calculateTieRate(b) < calculateTieRate(a)) return -1;
          }

          if (sortOrder === 'asc') {
            if (calculateTieRate(a) > calculateTieRate(b)) return 1;
            if (calculateTieRate(b) > calculateTieRate(a)) return -1;
          }
        }
        return 0;
      }),
    ...rest,
  };
};
