import { useQuery } from "@tanstack/react-query";
import supabase from "../../lib/supabase/client"
import { useUser } from "@supabase/auth-helpers-react";
import { GameLogAction, parseGameLog } from "./helpers";

export interface SupabaseGameLog {
  id: number;
  created_at: string;
  raw_game_log: string;
}

export interface GameLog {
  id: number;
  date: string;
  log: GameLogAction[];
}

const fetchGameLogs = async (userId?: string) => {
  if (!userId) return null;

  const res = await supabase.from('Game Logs').select('id,created_at,raw_game_log').eq('user_id', userId).returns<SupabaseGameLog[]>();
  return res.data?.map((data): GameLog => ({
    id: data.id,
    date: data.created_at,
    log: parseGameLog(data.raw_game_log)
  }));
}

export const useGameLogs = () => {
  const user = useUser();

  return useQuery({
    queryKey: ['game-logs', user?.id],
    queryFn: () => fetchGameLogs(user?.id)
  })
}