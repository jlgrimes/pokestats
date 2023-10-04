import { useQuery } from "@tanstack/react-query"
import supabase from "../lib/supabase/client"
import { capitalize } from "../lib/strings";
import { Tournament } from "../../types/tournament";
import { cropPlayerName, getPlayerRegion, getRoundsArray } from "../lib/fetch/fetchLiveResults";
import { AgeDivision } from "../../types/age-division";
import { getTournamentRoundSchema } from "../lib/tournament";

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

const fetchStandings = async (params: UseStandingsParams) => {
  let query = supabase.from('standings_new').select('*,deck_archetype(id,defined_pokemon)').eq('tournament_id', params.tournament.id);
  query = query.eq('age_division', capitalize(params.ageDivision));
  query = query.order('placing', { ascending: true });

  const standingsRes = await query;
  
  return standingsRes.data?.map((standing) => ({
    ...standing,
    name: cropPlayerName(standing.name),
    region: getPlayerRegion(standing.name)?.at(1),
    rounds: getRoundsArray(standing)
  }));
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