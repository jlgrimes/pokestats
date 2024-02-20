import { CreateToastFnReturn } from "@chakra-ui/react";
import supabase from "../../lib/supabase/client"

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
  return rawGameLog.split('\n').map((line) => {
    return { message: line }
  });
}