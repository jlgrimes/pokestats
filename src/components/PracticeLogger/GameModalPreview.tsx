import { Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { GameLog } from "./useGameLogs";
import { Bold, Card, Flex, Text } from "@tremor/react";
import { GameLogView } from "./GameLogView";
import { ResultLetter } from "../Tournament/Home/PlayerCard/PlayerCard";
import { formatDistanceToNow, parseISO } from "date-fns";
import SpriteDisplay from "../common/SpriteDisplay/SpriteDisplay";

interface GameModalPreviewProps {
  gameLog: GameLog;
}

export const DateSinceGame = (props: GameModalPreviewProps) => <Text className="text-xs font-normal">{formatDistanceToNow(parseISO(props.gameLog.date), { 'addSuffix': true })}</Text>

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
                <DateSinceGame gameLog={props.gameLog} />
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
          <ModalHeader>
            <div className="flex flex-col gap-1">
              <Text className="font-bold">Game against {props.gameLog.opponentScreenName}</Text>
              <DateSinceGame gameLog={props.gameLog} />
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <GameLogView gameLog={props.gameLog} />
        </ModalContent>
      </Modal>
    </>
  )
}