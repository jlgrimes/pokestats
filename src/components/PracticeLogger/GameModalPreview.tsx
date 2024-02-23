import { Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { GameLog } from "./useGameLogs";
import { Bold, Card, Flex, Text } from "@tremor/react";
import { GameLogView } from "./GameLogView";
import { ResultLetter } from "../Tournament/Home/PlayerCard/PlayerCard";
import { formatDistanceToNow, parseISO } from "date-fns";
import SpriteDisplay from "../common/SpriteDisplay/SpriteDisplay";
import { PrizeMap } from "./PrizeMap";
import { useIsMobile } from "../../hooks/device";

interface GameModalPreviewProps {
  gameLog: GameLog;
}

export const DateSinceGame = (props: GameModalPreviewProps) => <Text className="text-xs font-normal">{formatDistanceToNow(parseISO(props.gameLog.date), { 'addSuffix': true })}</Text>

export const GameModalPreview = (props: GameModalPreviewProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useIsMobile();

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
        <ModalContent margin={isMobile ? 'auto' : 0}>
          <ModalHeader>
            <div className="flex flex-col">
              <Bold>Game against {props.gameLog.opponentScreenName}</Bold>
              <DateSinceGame gameLog={props.gameLog} />
            </div>
          </ModalHeader>
          <ModalCloseButton />
          <div className="flex flex-col gap-2">
            <PrizeMap gameLog={props.gameLog} />
            <GameLogView gameLog={props.gameLog} />
          </div>
        </ModalContent>
      </Modal>
    </>
  )
}