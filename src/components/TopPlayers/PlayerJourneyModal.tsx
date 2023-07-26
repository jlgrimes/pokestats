import { Box, Grid, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack, Text, UseDisclosureProps } from "@chakra-ui/react"
import { PropsWithChildren } from "react";
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

const TableHeading = (props: PropsWithChildren) =>  <Text fontWeight={'bold'} color='gray.400' fontSize={'sm'} textTransform='uppercase' letterSpacing={0.5}>{props.children}</Text>

export const PlayerJourneyModal = (props: PlayerJourneyModalProps) => {
  const { data: journey } = useSeasonJourney(props.player.profile, 2023);
  const majorsPoints = journey?.reduce((acc: number, curr) => acc + curr.pointsEarned, 0) ?? 0;
  const localsPoints = props.player.points - majorsPoints;

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <ModalOverlay />
      <ModalContent my={{ base: 0, sm: 16 }}>
        <ModalCloseButton />
        <ModalHeader pb={2}>{props.player.name}'s 2023 season</ModalHeader>
        <ModalBody>
          <Stack>
            <Grid gridTemplateColumns={'3fr 1fr 1fr 3fr'} alignItems='center' columnGap={2} rowGap={1}>
              <TableHeading>Event</TableHeading>
              <TableHeading>Points</TableHeading>
              <TableHeading>Place</TableHeading>
              <TableHeading>Deck</TableHeading>

              {journey?.map((point) => <PlayerJourneyCard key={Math.random()} journeyPoint={point} />)}

              {localsPoints > 0 && (
                <>
                  <Text fontWeight={'semibold'} color='gray.800' fontSize={'md'}>Locals</Text>
                  <Text fontWeight='bold' fontSize='xl'>+{localsPoints}</Text>
                  <Box />
                  <Box />
                </>
              )}

              <Text fontWeight={'semibold'} color='gray.800' fontSize={'md'} pt='4'>Total</Text>
              <Text fontWeight='bold' fontSize='xl' gridColumn={'2/-1'} pt='4'>{props.player.points} CP</Text>
            </Grid>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}