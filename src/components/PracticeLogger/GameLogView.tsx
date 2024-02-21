import { Accordion, AccordionBody, AccordionHeader, AccordionList, Card, List, ListItem, Text } from "@tremor/react";
import { GameLog } from "./useGameLogs"

interface GameLogViewProps {
  gameLog: GameLog;
}


export const GameLogView = (props: GameLogViewProps) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      {
        props.gameLog.log.map((turn, idx) => (
          <Card key={`turn-${turn.whoseTurn}-${idx}`} className="p-0">
            <List className="p-4">
              {turn.actions.map((action, idx) => (
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
                      <p className={action.type === 'turn-number' ? 'font-bold' : ''}>{action.message}</p>
                    )
                  }
                </ListItem>
              ))}
            </List>
          </Card>
        ))
      }
    </div>
  )
}