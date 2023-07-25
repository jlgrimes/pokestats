import { Grid, HStack, Stack, Text } from "@chakra-ui/react";
import { JourneyPoint } from "../../hooks/leaderboards/useSeasonJourney"
import { ordinalSuffixOf } from "../../lib/strings";
import { reallyShortenTournamentName, shortenTournamentName } from "../../lib/tournament";
import { DeckInfoDisplay } from "../Deck/DeckInfoDisplay";

interface PlayerJourneyCardProps {
  journeyPoint: JourneyPoint;
}

export const PlayerJourneyCard = (props: PlayerJourneyCardProps) => {
  return (
    <>
      <Text fontWeight={'semibold'} color='gray.600' fontSize={'md'}>{reallyShortenTournamentName(props.journeyPoint.tournament)}</Text>
      <Text fontWeight='bold' fontSize='xl'>+{props.journeyPoint.pointsEarned}</Text>
      <Text fontWeight={'semibold'} color='gray.500'>{ordinalSuffixOf(props.journeyPoint.standing.placing)}</Text>
      <DeckInfoDisplay player={props.journeyPoint.standing} tournament={props.journeyPoint.tournament} enableEdits={false} isPlayerMeOrMyOpponent={false} />
    </>
  )
}