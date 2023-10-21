import { useQuery } from "@tanstack/react-query"
import supabase from "../lib/supabase/client"
import { capitalize } from "../lib/strings";
import { Deck, PlayerRecord, PlayerResistances, PlayerRound, Standing, Tournament, TournamentDate, TournamentStatus } from "../../types/tournament";
import { cropPlayerName, getPlayerDeck, getPlayerRegion, getRoundsArray } from "../lib/fetch/fetchLiveResults";
import { AgeDivision } from "../../types/age-division";
import { getTournamentRoundSchema, shortenTournamentName } from "../lib/tournament";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { CombinedPlayerProfile } from "../../types/player";
import { getStringifiedNames } from "../lib/query-helpers";

export const fixStoredDeck = (decklist: any) => {
  // if (decklist === '""') return {};

  // if (!decklist.pokemon) decklist = JSON.parse(decklist as unknown as string);
  return decklist;
}

interface StandingsWithDecksReturnType {
  name: string,
  placing: number,
  record: PlayerRecord,
  resistances: PlayerResistances,
  drop: number,
  rounds: Record<number, PlayerRound>,
  age_division: AgeDivision,
  region: string | null,
  decklist: string | null,
  deck_archetype: number,
  defined_pokemon: string[] | null,
  day_two: boolean | null;
  identifiable_cards: string[] | null,
  supertype: number | null,
  tournament_id: number,
  tournament_name: string,
  tournament_date: TournamentDate,
  tournament_status: TournamentStatus | null;
  tournament_round_number: number | null;
}

const fixDatabaseStandings = (data: StandingsWithDecksReturnType[] | null): Standing[] | undefined => data?.map((standing) => {
  const rounds = getRoundsArray(standing as Standing);

  return {
    ...standing,
    rounds: rounds.map((round) => ({ ...round, name: cropPlayerName(round.name) })),
    decklist: standing.decklist ? JSON.parse(standing.decklist) : null,
    currentOpponent: (standing.tournament_round_number && standing.tournament_round_number < rounds.length) ? rounds[standing.tournament_round_number] : undefined,
    currentMatchResult: (standing.tournament_round_number && standing.tournament_round_number < rounds.length) ? rounds[standing.tournament_round_number]?.result : undefined,
    tournament_name: shortenTournamentName({ name: standing.tournament_name, date: standing.tournament_date } as Tournament)
  }
});

export const fetchChampions = async (): Promise<Standing[] | undefined> => {
  let query = supabase.from('standings_with_decks').select('*').eq('placing', 1).eq('age_division', 'masters').returns<StandingsWithDecksReturnType[]>();

  const standingsRes = await query;

  return fixDatabaseStandings(standingsRes.data);
}

export const useChampions = () => {
  return useQuery({
    queryKey: ['champions'],
    queryFn: fetchChampions
  });
}

export const fetchStandings = async (params: UseStandingsParams) => {
  let query = supabase.from('standings_with_decks').select('*').eq('tournament_id', params.tournament.id);
  query = query.eq('age_division', capitalize(params.ageDivision));
  query = query.order('placing', { ascending: true });

  const standingsRes = await query.returns<[]>();
  const standings = fixDatabaseStandings(standingsRes.data);

  if (params?.shouldLoadOpponentRounds) {
    if (!standingsRes.data) return null;
    const updatedStandings = await loadOpponentRounds(standingsRes.data);
    return updatedStandings;
  }
  
  return standings;
}

interface UseStandingsParams {
  tournament: Tournament;
  ageDivision: AgeDivision;
  shouldLoadOpponentRounds?: boolean;
}

export const useStandings = (params: UseStandingsParams) => {
  return useQuery({
    queryKey: ['standings', params.tournament.id, params.ageDivision],
    queryFn: () => fetchStandings(params)
  });
}

export const fetchTopCut = async (params: UseStandingsParams) => {
  let query = supabase.from('standings_with_decks').select('*')
  query = query.eq('tournament_id', params.tournament.id)
  query = query.eq('age_division', capitalize(params.ageDivision));
  query = query.lte('placing', 8);

  const standingsRes = await query;
  const standings = fixDatabaseStandings(standingsRes.data);

  if (params?.shouldLoadOpponentRounds && standings) {
    if (!standingsRes.data) return null;
    const updatedStandings = await loadOpponentRounds(standings);
    return updatedStandings;
  }
  
  return standings;
}

export const useTopCutStandings = (params: UseStandingsParams) => {
  return useQuery({
    queryKey: ['top-cut', params.tournament.id, params.ageDivision],
    queryFn: () => fetchTopCut(params)
  });
}

interface UsePlayerStandingsParams {
  tournament?: Tournament;
  shouldLoadOpponentRounds?: boolean;
}

const loadOpponentRounds = async (standings: Standing[]): Promise<Standing[]> => {
  const opponentList = standings.reduce((acc: string[], curr: Standing) => {
    const opponentRounds = curr.rounds?.map((round) => round.name) ?? [];
    return [...acc, ...opponentRounds]
  }, []);

  if (opponentList) {
    const stringifiedNames = getStringifiedNames(opponentList);

    const opponentRes = await supabase.from('standings_with_decks').select('*')
      .eq('tournament_id', standings[0]?.tournament_id)
      .or(`name.in.(${stringifiedNames})`)
      .returns<StandingsWithDecksReturnType[]>();
    const opponents = fixDatabaseStandings(opponentRes.data);

    if (opponents) {
      return standings.map(standing => ({
        ...standing,
        rounds: standing.rounds?.map((round, idx) => {
          const opponent = opponents.find((opponent) => opponent.name === round.name);

          if (!opponent) {
            return round;
          }

          const opponentStanding: Standing = {
            ...opponent,
            rounds: getRoundsArray(opponent as unknown as Standing),
            age_division: standing.age_division
          };

          return {
            ...round,
            opponent: opponentStanding,
          }
        })
      }))
    }
  }

  return standings;
}

export const fetchPlayerStandings = async (player: CombinedPlayerProfile | null | undefined, params?: UsePlayerStandingsParams): Promise<Standing[] | null | undefined> => {
  if (!player) return null;

  let query = supabase.from('standings_with_decks').select('*').order('tournament_date->end', { ascending: false });

  if (params?.tournament) {
    query = query.eq('tournament_id', params.tournament.id);
  }

  if (player.additional_names) {
    const nameQueryString = [player.name, ...player.additional_names]
      .map(name => `name.eq.${name}`)
      .join(',');
    query = query.or(nameQueryString);
  } else {
    query = query.ilike('name', player.name);
  }

  const standingsRes = await query;
  const standings = fixDatabaseStandings(standingsRes.data);

  if (params?.shouldLoadOpponentRounds) {
    // If name hasn't loaded yet, don't bother fetching.
    if (!player.name || !standings) return null;
    const updatedStandings = await loadOpponentRounds(standings);
    return updatedStandings;
  }

  return standings;
}

export const usePlayerStandings = (player: CombinedPlayerProfile | null | undefined, params?: UsePlayerStandingsParams) => {
  return useQuery({
    queryKey: ['player-standings', player?.id, params?.tournament?.id, params?.shouldLoadOpponentRounds],
    queryFn: () => fetchPlayerStandings(player, params)
  });
}

export const fetchDeckStandings = async (deck: Deck, tournamentId: number, shouldFetchOnlyDay2?: boolean): Promise<Standing[] | undefined> => {
  let query = supabase.from('standings_with_decks').select('*').eq('deck_archetype', deck.id).eq('tournament_id', tournamentId);
  
  if (shouldFetchOnlyDay2) {
    query = query.eq('day_two', true);
  }
  
  query = query.order('placing', { ascending: true });

  const standingsRes = await query;
  
  return fixDatabaseStandings(standingsRes.data);
}

export const useDeckStandings = (deck: Deck, tournamentId: number, shouldFetchOnlyDay2?: boolean) => {
  return useQuery({
    queryKey: ['deck-standings', deck.id, tournamentId, shouldFetchOnlyDay2],
    queryFn: () => fetchDeckStandings(deck, tournamentId, shouldFetchOnlyDay2)
  });
}

export const fetchStandingsWithName = async (name: string): Promise<Standing[] | undefined> => {
  let query = supabase.from('standings_with_decks').select('*');
  query = query.eq('name', name);

  const standingsRes = await query;
  
  return fixDatabaseStandings(standingsRes.data);
}

export const useStandingsWithName = (name: string) => {
  return useQuery({
    queryKey: ['standings-with-name', name],
    queryFn: () => fetchStandingsWithName(name)
  });
}

export const fetchFollowingStandings = async (namesList: string[] | undefined, tournament: Tournament): Promise<Standing[] | undefined> => {
  if (!namesList) return undefined;

  let query = supabase.from('standings_with_decks').select('*');

  const stringifiedNames = getStringifiedNames(namesList);
  query = query.or(`name.in.(${stringifiedNames})`)
  query = query.eq('tournament_id', tournament.id);

  const standingsRes = await query;
  
  return fixDatabaseStandings(standingsRes.data);
}

export const useFollowingStandings = (namesList: string[] | undefined, tournament: Tournament) => {
  return useQuery({
    queryKey: ['following-standings', namesList, tournament],
    queryFn: () => fetchFollowingStandings(namesList, tournament)
  });
}

export const fetchAllPlayerNames = async () => {
  const names = await supabase.rpc('distinct_names').returns<{ name: string }[]>();
  return names.data;
}

export const useAllPlayerNames = () => {
  return useQuery({
    queryKey: ['all-player-names'],
    queryFn: () => fetchAllPlayerNames()
  });
}