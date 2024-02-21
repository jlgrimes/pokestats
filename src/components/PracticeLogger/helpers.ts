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

export type GameLogActionMechanicType = 'description' | 'cards';

export interface GameLogActionMechanic {
  message: string;
  type: GameLogActionMechanicType;
}

export interface GameLogAction {
  message: string;
  // Anything like Jared drew 3 cards off a supporter etc
  actionMechanics?: GameLogActionMechanic[]
}

export const parseGameLog = (rawGameLog: string): GameLogAction[] => {
  return rawGameLog.split('\n').reduce((acc: GameLogAction[], line: string) => {
    line = line.trim();
    if (line.length === 0) return acc;

    console.log(line[0])
    if (line[0] === '-' || line[0] === '*' || line[0] === '•') {
      const type: GameLogActionMechanicType = line[0] === '-' ? 'description' : 'cards'
      const message = line.substring(2);

      return [
        ...acc.slice(0, acc.length - 1),
        {
          ...acc[acc.length - 1],
          actionMechanics: [...(acc[acc.length - 1].actionMechanics ?? []), { type, message }]
        }
      ]
    }

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