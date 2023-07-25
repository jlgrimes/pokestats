import { Grid, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, Text, UseDisclosureProps } from "@chakra-ui/react"
import { CombinedPlayerProfile } from "../../../types/player";
import { Deck } from "../../../types/tournament";
import { PlayerOnLeaderboard } from "../../hooks/leaderboards/useLeaderboard";
import { useSeasonJourney } from "../../hooks/leaderboards/useSeasonJourney";
import { PlayerJourneyCard } from "./PlayerJourneyCard";

interface PlayerJourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: PlayerOnLeaderboard;
}

export const PlayerJourneyModal = (props: PlayerJourneyModalProps) => {
  const { data: journey } = useSeasonJourney(props.player.profile, 2023);
  const majorsPoints = journey?.reduce((acc: number, curr) => acc + curr.pointsEarned, 0) ?? 0;
  const localsPoints = props.player.points - majorsPoints;

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent my={{ base: 0, sm: 16 }}>
        <ModalCloseButton />
        <ModalHeader>{props.player.name}'s 2023 season</ModalHeader>
        <ModalBody>
          <Stack>
            <Grid gridTemplateColumns={'3fr 1fr 1fr 3fr'} alignItems='center' gap={2}>
              {journey?.map((point) => <PlayerJourneyCard key={Math.random()} journeyPoint={point} />)}
            </Grid>
            <Grid gridTemplateColumns={'3fr 1fr 4fr'} alignItems='center' gap={2}>
              <Text fontWeight={'semibold'} color='gray.600' fontSize={'md'}>Locals</Text>
              <Text fontWeight='bold' fontSize='xl'>+{localsPoints}</Text>
              <Text fontWeight={'semibold'} color='gray.500'>Various events</Text>
            </Grid>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}