import { useQuery } from '@tanstack/react-query';
import { FinalResultsSchema } from '../../types/final-results';
import { Card, Deck, Standing } from '../../types/tournament';
import { getCardCount } from '../components/Deck/ListViewer/CardViewer.tsx/helpers';
import supabase from '../lib/supabase/client';
import { useArchetypes } from './deckArchetypes';
import { fetchAllVerifiedUsers } from './user';
import { getCompressedList } from '../components/Deck/ListViewer/helpers';

interface FinalResultsFilters {
  tournamentId?: string;
  deckId?: number;
  playerName?: string;
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
  const uniqueDecks = Array.from(new Set(res.data ?? []));
  return uniqueDecks;
};

export const fetchDecksWithLists = async () => {
  const res = await supabase
    .from('Final Results')
    .select(`deck_archetype,tournament_id`)
    .not('deck_archetype', 'is', null);

  return res.data;
};

export const useStoredDecks = (options?: {
  tournamentRange?: number[];
}): {
  deck: Deck;
  count: number;
}[] => {
  const { data: archetypes } = useArchetypes();

  let { data: decks } = useQuery({
    queryKey: ['decks-with-lists'],
    queryFn: () => fetchDecksWithLists(),
  });

  if (decks && options?.tournamentRange) {
    decks = filterFinalResultsByTournament(decks, options.tournamentRange);
  }

  const deckCounts = decks?.reduce((acc: Record<number, number>, curr) => {
    if (acc[curr.deck_archetype]) {
      return {
        ...acc,
        [curr.deck_archetype]: acc[curr.deck_archetype] + 1,
      };
    }

    return {
      ...acc,
      [curr.deck_archetype]: 1,
    };
  }, {});

  if (deckCounts) {
    const ret = Object.entries(deckCounts)
      ?.map(([deckId, count]) => ({
        deck: archetypes?.find(({ id }) => parseInt(deckId) === id) as Deck,
        count,
      }))
      .sort((a, b) => {
        if (a.count < b.count) return 1;
        if (b.count < a.count) return -1;
        return 0;
      });
    return ret;
  }

  return [];
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
  finalResults: { tournament_id: string; deck_archetype: number }[],
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
      `name,placing,record,resistances,drop,rounds,tournament_id,deck_list,deck_archetype (
    id,
      name,
      defined_pokemon,
      identifiable_cards,
      supertype
    )`
    )
    .order('tournament_id', { ascending: false })
    .order('placing', { ascending: true });

  if (filters?.tournamentId) {
    query = query.eq('tournament_id', filters.tournamentId);
  }
  if (filters?.deckId) {
    query = query.eq('deck_archetype', filters.deckId);
  }
  if (filters?.playerName) {
    query = query.eq('name', filters.playerName);
  }

  const res = await query;
  const finalResultsData: FinalResultsSchema[] | null = res.data;

  let userReportedDecks: Deck[] | undefined | null = null;
  if (filters?.playerName) {
    const playerDecks = await fetchDecksByPlayer(filters.playerName);
    userReportedDecks = playerDecks?.map(
      ({ deck_archetype, tournament_id }) => ({
        ...(Array.isArray(deck_archetype)
          ? deck_archetype[0]
          : (deck_archetype as Deck)),
        tournament_id,
      })
    );
  }

  let mappedFinalResults = finalResultsData?.map(finalResult => {
    const userReportedDeck = userReportedDecks?.find(
      deck => finalResult.tournament_id === deck.tournament_id
    );

    if (!userReportedDeck || finalResult.deck_list)
      return {
        ...finalResult,
        tournamentId: finalResult.tournament_id,
      };

    return {
      ...finalResult,
      tournamentId: finalResult.tournament_id,
      deck: {
        ...userReportedDeck,
        ...(finalResult.deck_list ? { list: finalResult.deck_list } : {}),
      },
    };
  });

  return mappedFinalResults;
};

export const useFinalResults = (filters?: FinalResultsFilters) => {
  return useQuery({
    queryKey: ['final-results', ...Object.entries(filters ?? [])],
    queryFn: () => fetchFinalResults(filters),
  });
};

export const useCardCounts = (
  deck: Deck,
  options?: { countCopies?: boolean }
) => {
  const { data: deckStandings } = useFinalResults({ deckId: deck.id });

  if (!deckStandings) return [];

  const cardCounts = deckStandings?.reduce(
    (acc: Record<string, number>, deck) => {
      let cardMap = acc;

      if (deck.deck_list) {
        const compressedList = getCompressedList(deck.deck_list);

        for (const card of compressedList) {
          if (cardMap[card.name]) {
            cardMap[card.name] =
              cardMap[card.name] + (options?.countCopies ? card.count : 1);
          } else {
            cardMap[card.name] = options?.countCopies ? card.count : 1;
          }
        }
      }

      return cardMap;
    },
    {}
  );

  const cardCountsSorted = Object.entries(cardCounts).sort((a, b) => {
    if (a[0] > b[0]) return -1;
    if (b[0] < a[0]) return 1;
    return 0;
  });

  return cardCountsSorted;
};

export const useTechs = (deck: Deck) => {
  const cardCounts = useCardCounts(deck);
  return cardCounts;
};
