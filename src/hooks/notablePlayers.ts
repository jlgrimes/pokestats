import { useQuery } from "react-query";
import supabase from "../lib/supabase/client";

export const useNotablePlayers = (tournamentName: string) => {
  const fetchArchetypes = async () => {
    const res = await supabase
      .from('Notable Players')
      .select('player_name,deck_archetype')
      .eq('tournament_name', tournamentName);
    return res.data;
  };

  return useQuery(`notable-players-${tournamentName}`, fetchArchetypes);
}