import { useQuery } from '@tanstack/react-query';
import { FinalResultsSchema } from '../../types/final-results';
import { DeckCard, Deck, Standing } from '../../types/tournament';
import supabase from '../lib/supabase/client';
import { DeckTypeSchema, useArchetypes, useSupertypes } from './deckArchetypes';
import { fetchAllVerifiedUsers } from './user';
import { fetchPlayerDecks } from './playerDecks';
import {
  getCompressedList,
  getSameCardIdx,
} from '../components/Deck/ListViewer/helpers';

interface FinalResultsFilters {
  tournamentId?: string;
  deckId?: number | null;
  supertypeId?: number;
  playerName?: string | null;
  placing?: number;
}

export const fetchDecksByPlayer = async (name: string) => {
  const res = await supabase
    .from('Player Decks')
    .select(
      `tournament_id,deck_archetype (
      id,
      name,
      defined_pokemon,
      identifiable_cards,
      supertype
    )`
    )
    .eq('player_name', name);
  return res.data;
};

export const fetchUniqueDecks = async () => {
  const res = await supabase
    .from('Final Results')
    .select(`deck_archetype`)
    .neq('deck_archetype', null);

  if (!res.data) return [];

  const deckCounts = getDeckCounts(
    res.data.map(({ deck_archetype }) => deck_archetype)
  );

  const uniqueDecks = Array.from(new Set(res.data ?? []));
  return uniqueDecks;
};

export const fetchPlayers = async () => {
  const res = await supabase.from('Final Results').select('name');
  const uniqueNames: string[] = Array.from(
    new Set(res.data?.map(({ name }) => name) ?? [])
  );
  return uniqueNames;
};

interface FinalResultsDeckSchema {
  deck_archetype: number;
  deck_supertype: number;
  tournament_id: string;
}

export const fetchDecksWithLists = async (
  tournamentRange?: number[]
): Promise<FinalResultsDeckSchema[] | null> => {
  const res = await supabase
    .from('Final Results')
    .select(`deck_archetype,deck_supertype,tournament_id`)
    .not('deck_archetype', 'is', null);

  if (res.data && tournamentRange) {
    return filterFinalResultsByTournament(res.data, tournamentRange);
  }

  return res.data;
};

const getDeckCounts = (
  decks: FinalResultsDeckSchema[],
  shouldDrillDown?: boolean
) =>
  decks?.reduce((acc: Record<string, number>, curr) => {
    if (!shouldDrillDown && curr.deck_supertype) {
      if (acc[`supertype${curr.deck_supertype}`]) {
        return {
          ...acc,
          [`supertype${curr.deck_supertype}`]:
            acc[`supertype${curr.deck_supertype}`] + 1,
        };
      }

      return {
        ...acc,
        [`supertype${curr.deck_supertype}`]: 1,
      };
    }

    if (acc[`archetype${curr.deck_archetype}`]) {
      return {
        ...acc,
        [`archetype${curr.deck_archetype}`]:
          acc[`archetype${curr.deck_archetype}`] + 1,
      };
    }

    return {
      ...acc,
      [`archetype${curr.deck_archetype}`]: 1,
    };
  }, {});

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

export const fetchVerifiedUserTournaments = async () => {
  const verifiedUsers = await fetchAllVerifiedUsers();
  const verifiedUserEmailMap: Record<string, string> =
    verifiedUsers?.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.name]: curr.email,
      };
    }, {}) ?? {};

  const res = await supabase
    .from('Final Results')
    .select(`name,tournament_id`)
    .filter(
      'name',
      'in',
      JSON.stringify(verifiedUsers?.map(({ name }) => name as string) ?? [])
        .replace('[', '(')
        .replace(']', ')')
    );

  return res.data?.map(result => ({
    ...result,
    email: verifiedUserEmailMap[result.name],
  }));
};

const filterFinalResultsByTournament = (
  finalResults: {
    tournament_id: string;
    deck_archetype: number;
    deck_supertype: number;
  }[],
  tournamentRange: number[]
) => {
  const lowerBound = tournamentRange[0];
  const upperBound = tournamentRange.length > 0 ? tournamentRange[1] : null;

  return finalResults?.filter(({ tournament_id }) => {
    if (parseInt(tournament_id) < lowerBound) {
      return false;
    }

    if (upperBound && parseInt(tournament_id) > upperBound) {
      return false;
    }

    return true;
  });
};

export const fetchFinalResults = async (
  filters?: FinalResultsFilters
): Promise<Standing[] | null | undefined> => {
  let query = supabase
    .from('Final Results')
    .select(
      `name,placing,record,resistances,rounds,tournament_id,deck_list,deck_archetype (
    id,
      name,
      defined_pokemon,
      identifiable_cards,
      supertype
    ),deck_supertype`
    )
    .order('tournament_id', { ascending: false })
    .order('placing', { ascending: true });

  if (filters?.tournamentId) {
    query = query.eq('tournament_id', filters.tournamentId);
  }
  if (filters?.deckId) {
    query = query.eq('deck_archetype', filters.deckId);
  }
  if (filters?.supertypeId) {
    query = query.eq('deck_supertype', filters.supertypeId);
  }
  if (filters?.playerName) {
    query = query.eq('name', filters.playerName);
  }
  if (filters?.placing) {
    query = query.eq('placing', filters.placing);
  }

  const res = await query;
  const finalResultsData: FinalResultsSchema[] | null = res.data as unknown as
    | FinalResultsSchema[]
    | null;

  let userReportedDecks: Deck[] | undefined | null = null;
  if (filters?.playerName) {
    const playerDecks = await fetchDecksByPlayer(filters.playerName);
    userReportedDecks = playerDecks?.map(
      ({ deck_archetype, tournament_id }) => ({
        player_name: filters.playerName,
        ...(Array.isArray(deck_archetype)
          ? deck_archetype[0]
          : (deck_archetype as Deck)),
        tournament_id,
      })
    );
  } else if (filters?.supertypeId) {
    console.log('in');
    const playerDecks = await fetchPlayerDecks({
      supertypeId: filters.supertypeId,
    });
    userReportedDecks = playerDecks?.map(({ deck_archetype, player_name }) => ({
      player_name,
      ...(Array.isArray(deck_archetype)
        ? deck_archetype[0]
        : (deck_archetype as Deck)),
    }));
  }
  console.log(userReportedDecks);

  let mappedFinalResults = finalResultsData?.map(finalResult => {
    const finalResultAsStanding: Standing = {
      ...finalResult,
      deck: {
        ...(finalResult.deck_archetype ?? {}),
        ...(finalResult.deck_list
          ? {
              list: finalResult.deck_list,
            }
          : {}),
      },
      name: finalResult.name,
      placing: finalResult.placing,
      record: finalResult.record,
      resistances: finalResult.resistances,
      tournamentId: finalResult.tournament_id,
    };

    const userReportedDeck = userReportedDecks?.find(
      deck => finalResult.name === deck.player_name
    );

    if (!userReportedDeck || finalResult.deck_list)
      return finalResultAsStanding;

    return {
      ...finalResultAsStanding,
      deck: userReportedDeck,
    };
  });

  return mappedFinalResults;
};

export const useFinalResults = (filters?: FinalResultsFilters) => {
  return useQuery({
    queryKey: ['final-results', filters],
    queryFn: () => fetchFinalResults(filters),
  });
};

export const useChampions = () => {
  const { data, ...rest } = useFinalResults({ placing: 1 });

  const champions: Record<string, FinalResultsSchema> | undefined =
    data?.reduce((acc, curr) => {
      if (curr.placing !== 1 || !curr.tournamentId) return acc;

      return {
        ...acc,
        [curr.tournamentId]: curr,
      };
    }, {});

  return {
    data: champions,
    ...rest,
  };
};

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
