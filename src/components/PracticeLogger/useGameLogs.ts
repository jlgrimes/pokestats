import { useQuery } from "@tanstack/react-query";
import supabase from "../../lib/supabase/client"
import { useUser } from "@supabase/auth-helpers-react";

export interface GameLog {
  id: number;
  created_at: string;
  raw_game_log: string;
}

const fetchGameLogs = async (userId?: string) => {
  if (!userId) return null;

  const res = await supabase.from('Game Logs').select('id,created_at,raw_game_log').eq('user_id', userId).returns<GameLog[]>();
  return res.data;
}

export const useGameLogs = () => {
  const user = useUser();

  return useQuery({
    queryKey: ['game-logs', user?.id],
    queryFn: () => fetchGameLogs(user?.id)
  })
}