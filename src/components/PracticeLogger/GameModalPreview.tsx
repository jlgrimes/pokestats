import { Modal, ModalCloseButton, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { GameLog } from "./useGameLogs";
import { Card, Flex } from "@tremor/react";
import { GameLogView } from "./GameLogView";
import { ResultLetter } from "../Tournament/Home/PlayerCard/PlayerCard";
import { formatDistanceToNow, parseISO } from "date-fns";

interface GameModalPreviewProps {
  gameLog: GameLog;
}

export const GameModalPreview = (props: GameModalPreviewProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Card onClick={onOpen} className="cursor-pointer p-4">
        <Flex>
          <p>Game {formatDistanceToNow(parseISO(props.gameLog.date), { 'addSuffix': true })}</p>
          <ResultLetter result={props.gameLog.result} />
        </Flex>
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