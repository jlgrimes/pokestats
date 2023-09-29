import { useQuery } from "@tanstack/react-query"
import supabase from "../lib/supabase/client"

export const fixStoredDeck = (decklist: any) => {
  if (decklist === '""') return {};

  decklist = JSON.parse(decklist);
  if (!decklist.pokemon) decklist = JSON.parse(decklist as unknown as string);
  return decklist;
}

const fetchStandings = async (tournamentId: number) => {
  const liveStandings = await supabase.from('live_standings').select('*,deck_archetype(id,defined_pokemon)').eq('tournament_id', tournamentId).order('placing', { ascending: true });
  const standings = await supabase.from('standings_new').select('*,deck_archetype(id,defined_pokemon)').eq('tournament_id', tournamentId).order('placing', { ascending: true });
  
  return [
    ...(liveStandings.data ?? []),
    ...(standings.data ?? [])
  ].map((standing) => ({
    ...standing,
    decklist: fixStoredDeck(standing.decklist)
  }));
}

export const useStandings = (tournamentId: number) => {
  return useQuery({
    queryKey: ['standings', tournamentId],
    queryFn: () => fetchStandings(tournamentId)
  });
}