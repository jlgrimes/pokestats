import { Accordion, AccordionBody, AccordionHeader, AccordionList, Bold, Card, Flex, List, ListItem, Text } from "@tremor/react";
import { GameLog } from "./useGameLogs"
import { getCurrentNumPrizes } from "./helpers";
import SpriteDisplay from "../common/SpriteDisplay/SpriteDisplay";

interface GameLogViewProps {
  gameLog: GameLog;
}


export const GameLogView = (props: GameLogViewProps) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      {
        props.gameLog.log.map((turn, idx) => (
          <Card key={`turn-${turn.whoseTurn}-${idx}`} className="p-0" decoration={(turn.whoseTurn === 'my-turn' || turn.whoseTurn === 'opponent-turn') ? 'left' : null} decorationColor={turn.whoseTurn === 'my-turn' ? 'blue' : 'red'}>
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
                      <p className={(action.type === 'turn-number' || action.type === 'setup') ? 'font-bold' : ''}>{action.message}</p>
                    )
                  }
                </ListItem>
              ))}
            </List>
            <div className="flex gap-2 justify-center px-4 pb-4 text-gray-500 items-center">
              <SpriteDisplay shouldBlurSecondSprite squishWidth pokemonNames={props.gameLog.yourDeck?.defined_pokemon} />
              <div className="flex flex-col">
                  <div className="flex gap-1">
                    <Bold>{getCurrentNumPrizes(props.gameLog.log, idx).you}</Bold>
                    <div>-</div>
                    <Bold>{getCurrentNumPrizes(props.gameLog.log, idx).opp}</Bold>
                  </div>
                  <div className="flex justify-between">
                    <Text className={`text-xs ${turn.prizesTaken.you > 0 ? 'text-green-700 font-bold' : 'text-gray-400'}`}>+{turn.prizesTaken.you}</Text>
                    <Text className={`text-xs ${turn.prizesTaken.opp > 0 ? 'text-red-700 font-bold' : 'text-gray-400'}`}>+{turn.prizesTaken.opp}</Text>
                  </div>
              </div>
              <SpriteDisplay shouldBlurSecondSprite squishWidth pokemonNames={props.gameLog.opponentDeck?.defined_pokemon} />
            </div>
          </Card>
        ))
      }
    </div>
  )
}