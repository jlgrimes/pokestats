import { List, ListItem } from "@tremor/react";
import { GameLog } from "./useGameLogs"

interface GameLogViewProps {
  gameLog: GameLog;
}

export const GameLogView = (props: GameLogViewProps) => {
  console.log(props.gameLog)
  return (
    <List className="p-4">
      {props.gameLog.log.map((action, idx) => (
        <ListItem key={`${props.gameLog.id}-log-action-${idx}`}>{action.message}</ListItem>
      ))}
    </List>
  )
}