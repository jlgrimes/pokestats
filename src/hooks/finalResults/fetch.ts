import { FinalResultsSchema } from '../../../types/final-results';
import { Deck, Standing } from '../../../types/tournament';
import supabase from '../../lib/supabase/client';
import { fetchPlayerDecks } from '../playerDecks';
import { fetchAllVerifiedUsers } from '../user';
import {
  FinalResultsDeckSchema,
  FinalResultsFilters,
} from './final-results-schema';
import {
  addUserReportedDecksToFinalResults,
  filterFinalResultsByTournament,
  getDeckCounts,
  mapFinalResultsToStandings,
} from './helpers';

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

export const fetchDecksWithLists = async (
  tournamentRange?: number[]
): Promise<FinalResultsDeckSchema[] | null> => {
  const res = await supabase
    .from('Final Results')
    .select(`deck_archetype,deck_supertype,tournament_id`)
    .not('deck_list', 'is', null);

  if (res.data && tournamentRange) {
    return filterFinalResultsByTournament(res.data, tournamentRange);
  }

  return res.data;
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

  if (!finalResultsData) return null;

  const finalResultsAsStandings = mapFinalResultsToStandings(finalResultsData);

  if (userReportedDecks) {
    return addUserReportedDecksToFinalResults(
      finalResultsAsStandings,
      userReportedDecks
    );
  }
  return finalResultsAsStandings;
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
