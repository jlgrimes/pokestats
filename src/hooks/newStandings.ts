import { useQuery } from "@tanstack/react-query"
import supabase from "../lib/supabase/client"
import { capitalize } from "../lib/strings";
import { Tournament } from "../../types/tournament";
import { cropPlayerName, getPlayerRegion } from "../lib/fetch/fetchLiveResults";

export const fixStoredDeck = (decklist: any) => {
  // if (decklist === '""') return {};

  // if (!decklist.pokemon) decklist = JSON.parse(decklist as unknown as string);
  return decklist;
}

const fetchStandings = async (params: UseStandingsParams) => {
  const standings = await supabase.from(params.tournament.tournamentStatus === 'running' ? 'live_standings' : 'standings_new').select('*,deck_archetype(id,defined_pokemon)').eq('tournament_id', params.tournament.id).eq('age_division', capitalize(params.ageDivision)).order('placing', { ascending: true });
  return standings.data?.map((standing) => ({
    ...standing,
    name: cropPlayerName(standing.name),
    region: getPlayerRegion(standing.name)?.at(1)
  }));
}

interface UseStandingsParams {
  tournament: Tournament;
  ageDivision: string;
}

export const useStandings = (params: UseStandingsParams) => {
  return useQuery({
    queryKey: ['standings', params.tournament.id, params.ageDivision],
    queryFn: () => fetchStandings(params)
  });
}