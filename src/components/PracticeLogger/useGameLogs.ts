import { useQuery } from "@tanstack/react-query";
import supabase from "../../lib/supabase/client"
import { GameLogAction, GameTurn, mapSupabaseGameLogData, parseGameLog } from "./helpers";
import { useSessionPlayerProfile } from "../../hooks/user";
import { Deck, MatchResult } from "../../../types/tournament";
import { useAllDecks } from "../../hooks/deckArchetypes";

export interface SupabaseGameLog {
  id: number;
  created_at: string;
  raw_game_log: string;
}

export interface GameLog {
  id: number;
  date: string;
  log: GameTurn[];
  result: MatchResult;
  yourDeck?: Deck;
  opponentDeck?: Deck;
  opponentScreenName: string;
}

const fetchGameLogs = async (userId?: string, screenName?: string | null, deckArchetypes?: Deck[]) => {
  if (!userId || !screenName) return null;

  const res = await supabase.from('Game Logs').select('id,created_at,raw_game_log').eq('user_id', userId).order('created_at', { ascending: false }).returns<SupabaseGameLog[]>();
  return res.data?.map((log) => mapSupabaseGameLogData(log, screenName, deckArchetypes));
}

export const useGameLogs = () => {
  const { data: user } = useSessionPlayerProfile();
  const { data: deckArchetypes, isLoading } = useAllDecks();

  return useQuery({
    queryKey: ['game-logs', user?.id, user?.ptcg_live_name, isLoading],
    queryFn: () => fetchGameLogs(user?.id, user?.ptcg_live_name, deckArchetypes)
  })
}