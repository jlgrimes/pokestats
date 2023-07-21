import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { SupabaseClient } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query";

export interface PlayerOnLeaderboard {
  id: string;
  name: string;
  country_code: string;
  points: number;
}

const fetchLeaderboard = async (supabase: SupabaseClient, qualificationPeriod: number, isCompact: boolean) => {
  let query = supabase.from('Masters Leaderboard')
    .select('id,name,country_code,points')
    .eq('qualification_period', qualificationPeriod)
    .order('points', { ascending: false });

  if (isCompact) {
    query = query.range(1, 10);
  }

  const res = await query.returns<PlayerOnLeaderboard[]>();

  return res.data;
}

export const useLeaderboard = (qualificationPeriod: number, isCompact?: boolean) => {
  const supabase = useSupabaseClient();

  return useQuery({
    queryKey: ['leaderboard', qualificationPeriod, isCompact],
    queryFn: () => fetchLeaderboard(supabase, qualificationPeriod, !!isCompact)
  });
};