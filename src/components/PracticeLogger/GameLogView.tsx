import { GameLog } from "./useGameLogs"

interface GameLogViewProps {
  gameLog: GameLog;
}

export const GameLogView = (props: GameLogViewProps) => {
  return (
    <div>
      {props.gameLog.raw_game_log}
    </div>
  )
}