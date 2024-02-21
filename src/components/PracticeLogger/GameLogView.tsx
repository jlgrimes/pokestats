import { List, ListItem, Text } from "@tremor/react";
import { GameLog } from "./useGameLogs"

interface GameLogViewProps {
  gameLog: GameLog;
}

export const GameLogView = (props: GameLogViewProps) => {
  return (
    <List className="p-4">
      {props.gameLog.log.map((action, idx) => (
        <ListItem key={`${props.gameLog.id}-log-action-${idx}`}>
          <div>
            <p>{action.message}</p>
            <div className="pl-4">
              {action.actionMechanics?.map((mechanic, mechIdx) => (
                <p className="text-gray-500 text-sm" key={`${props.gameLog.id}-log-action-${idx}-${mechIdx}`}>{mechanic.message}</p>
              ))}
            </div>
          </div>
        </ListItem>
      ))}
    </List>
  )
}