import { Modal, ModalContent, ModalOverlay, UseDisclosureProps } from "@chakra-ui/react"
import { CombinedPlayerProfile } from "../../../types/player";
import { Deck } from "../../../types/tournament";
import { useSeasonJourney } from "../../hooks/leaderboards/useSeasonJourney";

interface PlayerJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: CombinedPlayerProfile;
}

export const PlayerJourneyModal = (props: PlayerJourneyModalProps) => {
  const { data: journey } = useSeasonJourney(props.player, 2023);

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent>
        {journey?.map((standing) => <div>{standing .name}</div>)}
      </ModalContent>
    </Modal>
  )
}