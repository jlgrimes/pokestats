import { Badge, BadgeDelta, Flex } from "@tremor/react";
import { Tournament } from "../../../types/tournament";
import {
  MoonIcon,
  StatusOnlineIcon
} from "@heroicons/react/outline";

interface TournamentStatusBadgesProps {
  tournament: Tournament;
}

export const TournamentStatusBadges = (props: TournamentStatusBadgesProps) => {
  return (
    <Flex className="justify-start gap-2 w-fit ml-4">
      {props.tournament.tournamentStatus === 'not-started' && (
        <Badge color='purple'>Upcoming</Badge>
      )}
      {props.tournament.tournamentStatus === 'running' && (
        <Badge icon={StatusOnlineIcon}>Live</Badge>
      )}
    </Flex>
  )
}