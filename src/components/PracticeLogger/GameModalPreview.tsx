import { Modal, ModalCloseButton, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { GameLog } from "./useGameLogs";
import { Bold, Card, Flex, Text } from "@tremor/react";
import { GameLogView } from "./GameLogView";
import { ResultLetter } from "../Tournament/Home/PlayerCard/PlayerCard";
import { formatDistanceToNow, parseISO } from "date-fns";
import SpriteDisplay from "../common/SpriteDisplay/SpriteDisplay";

interface GameModalPreviewProps {
  gameLog: GameLog;
}

export const GameModalPreview = (props: GameModalPreviewProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Card onClick={onOpen} className="cursor-pointer p-3">
        <div>
          <Flex>
            <div className={`flex gap-4`}>
              <div className={`${props.gameLog.result === 'L' ? 'opacity-50' : ''}`}>
                <SpriteDisplay shouldBlurSecondSprite squishWidth pokemonNames={props.gameLog.yourDeck?.defined_pokemon} />
              </div>
              <div className="flex flex-col">
                <Text className="text-sm">You {props.gameLog.result === 'W' ? 'beat' : 'lost to'} {props.gameLog.opponentScreenName}</Text>
                <Text className="text-xs">{formatDistanceToNow(parseISO(props.gameLog.date), { 'addSuffix': true })}</Text>
              </div>
            </div>
            <div className={`${props.gameLog.result === 'W' ? 'opacity-50' : ''}`}>
              <SpriteDisplay shouldBlurSecondSprite squishWidth pokemonNames={props.gameLog.opponentDeck?.defined_pokemon} />
            </div>
          </Flex>
        </div>
      </Card>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <GameLogView gameLog={props.gameLog} />
        </ModalContent>
      </Modal>
    </>
  )
}