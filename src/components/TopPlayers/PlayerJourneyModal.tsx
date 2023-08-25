import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { PlayerOnLeaderboard } from "../../hooks/leaderboards/useLeaderboard";
import { seasonToReadableYear } from "../Home/LeaderboardCard";
import { PlayerJourneyModalContent } from "./PlayerJourneyModalContent";

export interface PlayerJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerOnLeaderboard;
  season: number;
}

export const PlayerJourneyModal = (props: PlayerJourneyModalProps) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered>
      <ModalOverlay />
      <ModalContent my={{ base: 0, sm: 16 }}>
        <ModalCloseButton />
        <ModalHeader pb={2}>{`${props.player.profile?.name ?? props.player.name}'s ${seasonToReadableYear(props.season)} season`}</ModalHeader>
        <ModalBody minHeight={{ base: '90vh', sm: '560px'}} position={'relative'}>
          {props.isOpen && <PlayerJourneyModalContent {...props} />}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}