import { useQuery } from "@tanstack/react-query";
import supabase from "../../lib/supabase/client"

const fetchGameLogs = async (userId: string) => {
  const res = await supabase.from('Game Logs').select('*').eq('user_id', userId);
  return res.data;
}

export const useGameLogs = (userId: string) => {
  return useQuery({
    queryKey: ['game-logs', userId],
    queryFn: () => fetchGameLogs(userId)
  })
}