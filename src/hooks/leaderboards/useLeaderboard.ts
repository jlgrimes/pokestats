import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { SupabaseClient } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query";
import { CombinedPlayerProfile } from "../../../types/player";
import { useSmartPlayerProfiles } from "../user";

export interface PlayerOnLeaderboard {
  id: string;
  name: string;
  country_code: string;
  points: number;
  placing: number;
  profile?: CombinedPlayerProfile;
}

const fetchLeaderboard = async (supabase: SupabaseClient, qualificationPeriod: number, isCompact: boolean) => {
  let query = supabase.from('Masters Leaderboard')
    .select('id,name,country_code,points')
    .eq('qualification_period', qualificationPeriod)
    .order('points', { ascending: false });

  if (isCompact) {
    query = query.range(1, 16);
  }

  const res = await query.returns<PlayerOnLeaderboard[]>();

  return res.data;
}

const fetchMyLeaderboardStanding = async (supabase: SupabaseClient, qualificationPeriod: number, name: string | undefined) => {
  if (!name) return undefined;

  let query = supabase.from('Masters Leaderboard')
    .select('id,name,country_code,points,rank')
    .eq('qualification_period', qualificationPeriod)
    .eq('name', name)

  const res = await query.returns<PlayerOnLeaderboard[]>();

  return res.data?.at(0);
}

export const useLeaderboard = (qualificationPeriod: number, isCompact?: boolean) => {
  const supabase = useSupabaseClient();

  const { data, ...rest } = useQuery({
    queryKey: ['leaderboard', qualificationPeriod, isCompact],
    queryFn: () => fetchLeaderboard(supabase, qualificationPeriod, !!isCompact)
  });

  const { data: playerProfiles } = useSmartPlayerProfiles({ nameList: data?.map(({ name }) => name )})

  return {
    data: data?.map((player, idx) => ({
      ...player,
      placing: idx + 1,
      profile: playerProfiles?.find((playerProfile) => player.name === playerProfile.name || playerProfile.additional_names?.includes(player.name) || playerProfile.play_pokemon_name === player.name)
    })),
    ...rest
  }
};

export const useMyLeaderboardStanding = (qualificationPeriod: number) => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const {data: profile } = useSmartPlayerProfiles({ email: user?.email });

  const { data, ...rest } = useQuery({
    queryKey: ['my-leaderboard', qualificationPeriod],
    queryFn: () => fetchMyLeaderboardStanding(supabase, qualificationPeriod, profile?.at(0)?.name)
  });

  return {
    data,
    ...rest
  }
};