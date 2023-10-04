import { useQuery } from "@tanstack/react-query"
import supabase from "../lib/supabase/client"
import { capitalize } from "../lib/strings";
import { Deck, Standing, Tournament } from "../../types/tournament";
import { cropPlayerName, getPlayerRegion, getRoundsArray } from "../lib/fetch/fetchLiveResults";
import { AgeDivision } from "../../types/age-division";
import { getTournamentRoundSchema } from "../lib/tournament";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { CombinedPlayerProfile } from "../../types/player";
import { getStringifiedNames } from "../lib/query-helpers";

export const fixStoredDeck = (decklist: any) => {
  // if (decklist === '""') return {};

  // if (!decklist.pokemon) decklist = JSON.parse(decklist as unknown as string);
  return decklist;
}

export const getShouldHideDecks = (params: UseStandingsParams) => {
  const ageDivision = params.ageDivision;
  const roundNumber = params.tournament.roundNumbers[ageDivision];
  const tournamentRoundSchema = params.tournament.players[ageDivision]
    ? getTournamentRoundSchema(params.tournament, params.ageDivision)
    : undefined;
  const dayOneRounds = tournamentRoundSchema?.rounds.dayOneSwissRounds ?? 9; // Default to 9 i guess

  return roundNumber ? roundNumber < dayOneRounds : true;
}

const fixDatabaseStandings = (response: PostgrestSingleResponse<Record<any, any>[]>): Standing[] | undefined => response.data?.map((standing) => {
  const rounds = getRoundsArray(standing as Standing);
  const currentRound = rounds.length - 1;

  return {
    name: cropPlayerName(standing.name),
    region: getPlayerRegion(standing.name)?.at(1),
    rounds,
    tournament_id: Number.isInteger(standing.tournament_id) ? standing.tournament_id : standing.tournament_id.id,
    tournament: !Number.isInteger(standing.tournament_id) ? standing.tournament_id : null,
    placing: standing.placing,
    record: standing.record,
    age_division: standing.age_division,
    decklist: JSON.parse(standing.decklist),
    currentOpponent: standing.rounds[currentRound],
    currentMatchResult: standing.rounds[currentRound]?.result
  }
});

export const fetchChampions = async (): Promise<Standing[] | undefined> => {
  let query = supabase.from('standings_new').select('*,deck_archetype(id,defined_pokemon)').eq('placing', 1).returns<Standing[]>();

  const standingsRes = await query;

  return fixDatabaseStandings(standingsRes);
}

export const useChampions = () => {
  return useQuery({
    queryKey: ['champions'],
    queryFn: fetchChampions
  });
}

export const fetchStandings = async (params: UseStandingsParams) => {
  let query = supabase.from('standings_new').select('*,deck_archetype(id,defined_pokemon)').eq('tournament_id', params.tournament.id);
  query = query.eq('age_division', capitalize(params.ageDivision));
  query = query.order('placing', { ascending: true });

  const standingsRes = await query;
  
  return fixDatabaseStandings(standingsRes);
}

interface UseStandingsParams {
  tournament: Tournament;
  ageDivision: AgeDivision;
}

export const useStandings = (params: UseStandingsParams) => {
  return useQuery({
    queryKey: ['standings', params.tournament.id, params.ageDivision],
    queryFn: () => fetchStandings(params)
  });
}

export const fetchTopCut = async (params: UseStandingsParams) => {
  let query = supabase.from('standings_new').select('*,deck_archetype(id,defined_pokemon)').eq('tournament_id', params.tournament.id);
  query = query.eq('age_division', capitalize(params.ageDivision));
  query = query.lte('placing', 8);

  const standingsRes = await query;
  
  return fixDatabaseStandings(standingsRes);
}

export const useTopCutStandings = (params: UseStandingsParams) => {
  return useQuery({
    queryKey: ['top-cut', params.tournament.id, params.ageDivision],
    queryFn: () => fetchStandings(params)
  });
}

interface UsePlayerStandingsParams {
  tournament?: Tournament;
  shouldLoadOpponentRounds?: boolean;
}

export const fetchPlayerStandings = async (player: CombinedPlayerProfile | null | undefined, params?: UsePlayerStandingsParams) => {
  if (!player) return null;

  let query = supabase.from('standings_new').select('*,deck_archetype(id,defined_pokemon),tournament_id(*)');

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
  const standings = fixDatabaseStandings(standingsRes);

  if (params?.shouldLoadOpponentRounds) {
    // If name hasn't loaded yet, don't bother fetching.
    if (!player.name || !standings) return null;

    const finalRes = standings.at(0);
    const opponentList = finalRes?.rounds?.map((round) => cropPlayerName(round.name));
    
    if (opponentList) {
      const stringifiedNames = getStringifiedNames(opponentList);

      const opponentRes = await supabase
        .from('standings_new')
        .select(`name,placing,record,resistances,tournament_id,decklist,deck_archetype (
          id,
            name,
            defined_pokemon,
            identifiable_cards,
            supertype,
            format
          ),deck_supertype,rounds`)
        .eq('tournament_id', finalRes?.tournament_id)
        .or(`name.in.(${stringifiedNames})`);
      const opponents = opponentRes.data;

      if (opponents) {
        standings[0] = {
          ...standings[0],
          rounds: standings[0].rounds?.map((round, idx) => ({
            ...round,
            name: cropPlayerName(round.name),
            opponent: opponents.find((opponent) => cropPlayerName(opponent.name) === cropPlayerName(round.name))
          }))
        }
      }
    }
  }
  
  return standings;
}

export const usePlayerStandings = (player: CombinedPlayerProfile | null | undefined, params?: UsePlayerStandingsParams) => {
  return useQuery({
    queryKey: ['player-standings', player?.id, params?.tournament?.id, params?.shouldLoadOpponentRounds],
    queryFn: () => fetchPlayerStandings(player, params)
  });
}

export const fetchDeckStandings = async (deck: Deck): Promise<Standing[] | undefined> => {
  let query = supabase.from('standings_new').select('*,deck_archetype(id,defined_pokemon)');

  if (deck.classification === 'archetype') {
    query = query.eq('deck_archetype', deck.id);
  } else {
    // supertype
    query = query.eq('deck_archetype->supertype', deck.id);
  }

  const standingsRes = await query;
  
  return fixDatabaseStandings(standingsRes);
}

export const useDeckStandings = (deck: Deck) => {
  return useQuery({
    queryKey: ['deck-standings', deck.id],
    queryFn: () => fetchDeckStandings(deck)
  });
}

export const fetchStandingsWithName = async (name: string): Promise<Standing[] | undefined> => {
  let query = supabase.from('standings_new').select('*');
  query = query.eq('name', name);

  const standingsRes = await query;
  
  return fixDatabaseStandings(standingsRes);
}

export const useStandingsWithName = (name: string) => {
  return useQuery({
    queryKey: ['standings-with-name', name],
    queryFn: () => fetchStandingsWithName(name)
  });
}

export const fetchFollowingStandings = async (namesList: string[] | undefined, tournament: Tournament): Promise<Standing[] | undefined> => {
  if (!namesList) return undefined;

  let query = supabase.from('standings_new').select('*,deck_archetype(*)');

  const stringifiedNames = getStringifiedNames(namesList);
  query = query.or(`name.in.(${stringifiedNames})`)
  query = query.eq('tournament_id', tournament.id);

  const standingsRes = await query;
  
  return fixDatabaseStandings(standingsRes);
}

export const useFollowingStandings = (namesList: string[] | undefined, tournament: Tournament) => {
  return useQuery({
    queryKey: ['following-standings', namesList, tournament],
    queryFn: () => fetchFollowingStandings(namesList, tournament)
  });
}