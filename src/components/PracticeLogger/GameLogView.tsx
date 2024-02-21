import { Accordion, AccordionBody, AccordionHeader, AccordionList, List, ListItem, Text } from "@tremor/react";
import { GameLog } from "./useGameLogs"

interface GameLogViewProps {
  gameLog: GameLog;
}

export const GameLogView = (props: GameLogViewProps) => {
  return (
    <List className="p-4">
      {props.gameLog.log.map((action, idx) => (
        <ListItem key={`${props.gameLog.id}-log-action-${idx}`}>
          {
            action.actionMechanics ? (
              <Accordion className="p-0 [&>button]:p-0 border-none w-full">
                <AccordionHeader className="text-left">{action.message}</AccordionHeader>
                <AccordionBody className="pl-4 pb-0">
                  {action.actionMechanics?.map((mechanic, mechIdx) => (
                    <p className="text-gray-500 text-sm" key={`${props.gameLog.id}-log-action-${idx}-${mechIdx}`}>{mechanic.message}</p>
                  ))}
                </AccordionBody>
              </Accordion>
            ) : (
              <p>{action.message}</p>
            )
          }
        </ListItem>
      ))}
    </List>
  )
}