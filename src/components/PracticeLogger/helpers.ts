import { CreateToastFnReturn } from "@chakra-ui/react";
import supabase from "../../lib/supabase/client"
import { SupabaseGameLog } from "./useGameLogs";
import { MatchResult } from "../../../types/tournament";

export const uploadGameLog = async (userId: string, gameLog: string, toast: CreateToastFnReturn) => {
 const res = await supabase.from('Game Logs').insert({
    user_id: userId,
    raw_game_log: gameLog
  });

  if (res.error) {
    toast({
      status: 'error',
      title: 'Error uploading game log',
      description: res.error.message,
    });
    return null;
  }

  toast({
    status: 'success',
    title: 'Game log uploaded successfully',
  });
  return gameLog;
}

export interface GameLogAction {
  message: string;
}

export const parseGameLog = (rawGameLog: string): GameLogAction[] => {
  return rawGameLog.split('\n').reduce((acc: GameLogAction[], line: string) => {
    if (line.length === 0) return acc;

    return [...acc, { message: line }]
  }, []);
}

const getGameResult = (screenName: string, lastAction: string): MatchResult => {
  if (lastAction.includes(`${screenName} wins`)) return 'W';
  return 'L';
}

export const mapSupabaseGameLogData = (data: SupabaseGameLog, screenName: string) => {
  const gameLog = parseGameLog(data.raw_game_log);

  return {
    id: data.id,
    date: data.created_at,
    log: gameLog,
    result: getGameResult(screenName, gameLog[gameLog.length - 1].message)
  }
}