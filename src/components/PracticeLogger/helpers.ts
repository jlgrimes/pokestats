import { CreateToastFnReturn } from "@chakra-ui/react";
import supabase from "../../lib/supabase/client"
import { SupabaseGameLog } from "./useGameLogs";
import { Deck, MatchResult } from "../../../types/tournament";

export const uploadGameLog = async (userId: string, gameLog: string, screenName: string | null | undefined, toast: CreateToastFnReturn) => {
  if (!screenName || !gameLog.toLowerCase().includes(screenName.toLowerCase())) {
    toast({
      status: 'error',
      title: 'Make sure this game log is from a game you played',
    });
    return null;
  }

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

export type GameLogActionType = 'turn-number' | 'setup' | 'action';
export type TurnType = 'my-turn' | 'opponent-turn' | 'nobodys-turn';

export interface GameLogAction {
  message: string;
  // Anything like Jared drew 3 cards off a supporter etc
  actionMechanics?: GameLogActionMechanic[]
  type: GameLogActionType;
}

export interface GameTurn {
  whoseTurn: TurnType;
  actions: GameLogAction[];
  prizesTaken: PlayerPrizeCount
}

export interface PlayerPrizeCount {
  you: number;
  opp: number;
}

export const parseGameLog = (rawGameLog: string, screenName: string): GameLogAction[] => {
  return rawGameLog.split('\n').reduce((acc: GameLogAction[], line: string) => {
    line = line.trim();
    if (line.length === 0) return acc;

    line = line.replaceAll(`${screenName} wins`, 'You win');

    if (line.toLowerCase().includes('turn #')) {
      line = line.replaceAll(`${screenName}'s`, 'Your');
    } else {
      line = line.replaceAll(`${screenName}'s`, 'your');
    }

    line = line.replaceAll(`${screenName}`, 'you');
    line = line[0].toUpperCase() + line.substring(1);

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

    const type: GameLogActionType = line.toLowerCase().includes('turn #') ? 'turn-number' : line === 'Setup' ? 'setup' : 'action';
    return [...acc, { message: line, type }]
  }, []);
}

const parseTurns = (gameLog: GameLogAction[], screenName: string) => {
  return gameLog.reduce((acc: GameTurn[], curr: GameLogAction) => {
    if (acc.length === 0) {
      return [
        {
          whoseTurn: 'nobodys-turn' as TurnType,
          actions: [curr],
          prizesTaken: {
            you: 0,
            opp: 0
          }
        }
      ]
    }

    if (curr.message.includes('Turn #')) {
      const currWhoseTurn: TurnType = curr.message.toLowerCase().includes('you') ? 'my-turn' : 'opponent-turn';

      return [
        ...acc,
        {
          whoseTurn: currWhoseTurn,
          actions: [curr],
          prizesTaken: {
            you: 0,
            opp: 0
          }
        }
      ]
    }

    let prizesTaken = acc[acc.length - 1].prizesTaken;

    if (curr.message.includes('took') && curr.message.includes('Prize card')) {
      if (curr.message.includes('You')) {
        if (curr.message.includes('a Prize card')) {
          prizesTaken.you = 1;
        } else {
          const numPrizesTaken = curr.message.match(/took ([0-9])/g)?.[0].split(' ')[1];
          prizesTaken.you = parseInt(numPrizesTaken ?? '0');
        }
      } else {
        if (curr.message.includes('a Prize card')) {
          prizesTaken.opp = 1;
        } else {
          const numPrizesTaken = curr.message.match(/took ([0-9])/g)?.[0].split(' ')[1];
          prizesTaken.opp = parseInt(numPrizesTaken ?? '0');
        }
      }
    }

    return [
      ...acc.slice(0, acc.length - 1),
      {
        ...acc[acc.length - 1],
        actions: [...acc[acc.length - 1].actions, curr],
        prizesTaken
      }
    ]
  }, []);
}

/**
 * Gets the current number of prizes at a specific index in the game log.
 * 
 * @param gameLog - The game log in turns.
 * @param gameLogIdx - The index that is specified that would like to have prizes checked.
 * @returns - Number of prizes currently remaining for both players.
 */
export const getCurrentNumPrizes = (gameLog: GameTurn[], gameLogIdx: number): PlayerPrizeCount => {
  return gameLog.slice(0, gameLogIdx + 1).reduce((acc: PlayerPrizeCount, curr: GameTurn) => {
    return {
      you: acc.you - curr.prizesTaken.you,
      opp: acc.opp - curr.prizesTaken.opp
    }
  }, { you: 6, opp: 6 })
}

const getGameResult = (screenName: string, lastAction: string): MatchResult => {
  if (lastAction.includes(`You win`)) return 'W';
  return 'L';
}

const getOpponentScreenName = (gameLog: GameLogAction[]) => {
  for (const line of gameLog) {
    if (line.message.includes(' played') && !line.message.includes('You')) {
      return line.message.split(' ')[0];
    }
  }

  return '{}{}{}';
}

const getYourDeckArchetype = (gameLog: GameLogAction[], allDecks: Deck[]) => {
  const pokemonLinesInYourDeck = gameLog.reduce((acc: string[], curr) => {
    const match = curr.message.match(/[yY]our ([A-Za-z- ]*)/g);

    if (match) return [...acc, match[0]];
    return acc;
  }, []);

  for (const deck of allDecks) {
    if (deck.name !== 'Other' && deck.identifiable_cards?.every((card) => pokemonLinesInYourDeck.some((line) => line.includes(card)))) {
      return deck;
    }
  }
}

const getOpponentDeckArchetype = (gameLog: GameLogAction[], allDecks: Deck[]) => {
  const opponentScreenName = getOpponentScreenName(gameLog);
  const pokemonLinesInYourDeck = gameLog.reduce((acc: string[], curr) => {
    if (curr.message.split(' ')[0] === opponentScreenName) return [...acc, curr.message];
    return acc;
  }, []);

  for (const deck of allDecks) {
    if (deck.name !== 'Other' && deck.identifiable_cards?.every((card) => pokemonLinesInYourDeck.some((line) => line.includes(card)))) {
      return deck;
    }
  }
}

export const mapSupabaseGameLogData = (data: SupabaseGameLog, screenName: string, allDecks?: Deck[]) => {
  const gameLog = parseGameLog(data.raw_game_log, screenName);
  const yourDeck = allDecks ? getYourDeckArchetype(gameLog, allDecks) : null;
  const opponentDeck = allDecks ? getOpponentDeckArchetype(gameLog, allDecks) : null;
  console.log(parseTurns(gameLog, screenName))

  return {
    id: data.id,
    date: data.created_at,
    log: parseTurns(gameLog, screenName),
    result: getGameResult(screenName, gameLog[gameLog.length - 1].message),
    yourDeck,
    opponentDeck,
    opponentScreenName: getOpponentScreenName(gameLog)
  }
}