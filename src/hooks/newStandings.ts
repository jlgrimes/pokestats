import { useQuery } from "@tanstack/react-query"
import supabase from "../lib/supabase/client"

const fetchStandings = async (tournamentId: number) => {
  const liveStandings = await supabase.from('live_standings').select().eq('tournament_id', tournamentId).order('placing', { ascending: true });
  const standings = await supabase.from('standings_new').select().eq('tournament_id', tournamentId).order('placing', { ascending: true });
  return [
    ...(liveStandings.data ?? []),
    ...(standings.data ?? [])
  ];
}

export const useStandings = (tournamentId: number) => {
  return useQuery({
    queryKey: ['standings', tournamentId],
    queryFn: () => fetchStandings(tournamentId)
  });
}