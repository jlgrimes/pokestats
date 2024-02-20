import { Modal, ModalCloseButton, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { GameLog } from "./useGameLogs";
import { Card } from "@tremor/react";
import { GameLogView } from "./GameLogView";

interface GameModalPreviewProps {
  gameLog: GameLog;
}

export const GameModalPreview = (props: GameModalPreviewProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Card onClick={onOpen} className="cursor-pointer">{props.gameLog.created_at}</Card>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <GameLogView gameLog={props.gameLog} />
        </ModalContent>
      </Modal>
    </>
  )
}