import { useQuery } from '@tanstack/react-query';
import { FinalResultsSchema } from '../../types/final-results';
import { Deck, Standing } from '../../types/tournament';
import {
  fetchPlayerDecks,
  getPlayerDeckObjects,
} from '../lib/fetch/fetchLiveResults';
import supabase from '../lib/supabase/client';
import { useArchetypes } from './deckArchetypes';
import { fetchAllVerifiedUsers } from './user';

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

  return finalResultsData?.map(finalResult => {
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
};

export const useFinalResults = (filters?: FinalResultsFilters) => {
  return useQuery({
    queryKey: ['final-results', ...Object.entries(filters ?? [])],
    queryFn: () => fetchFinalResults(filters),
  });
};
