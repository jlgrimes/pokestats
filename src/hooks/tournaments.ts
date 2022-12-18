import { useQuery } from "react-query";
import { getResultQueryKey } from "../lib/fetch/query-keys";
import supabase from "../lib/supabase/client";

export const useTournaments = (tournamentName: string) => {
  const fetchTournaments = async () => {
    const res = await supabase
      .from('Tournaments')
      .select('id,name');
    return res.data;
  };

  return useQuery(
    getResultQueryKey(tournamentName),
    fetchTournaments
  );
}