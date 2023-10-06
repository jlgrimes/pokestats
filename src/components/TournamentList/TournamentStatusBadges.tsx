import { Badge, BadgeDelta, Flex } from "@tremor/react";
import { Tournament } from "../../../types/tournament";
import {
  MoonIcon,
  StatusOnlineIcon
} from "@heroicons/react/outline";
import { formatTournamentStatus } from "./helpers";
import { useUtcOffset } from "../../hooks/tournamentMetadata";

interface TournamentStatusBadgesProps {
  tournament: Tournament;
}

export const TournamentStatusBadges = (props: TournamentStatusBadgesProps) => {
  const utcOffset = useUtcOffset(props.tournament.id);

  return (
    <Flex className="justify-start gap-2 w-fit ml-6">
      {props.tournament.tournamentStatus === 'not-started' && (
        <Badge color='purple'>{formatTournamentStatus(props.tournament, utcOffset)}</Badge>
      )}
      {props.tournament.tournamentStatus === 'running' && (
        <Badge icon={StatusOnlineIcon}>Live</Badge>
      )}
    </Flex>
  )
}