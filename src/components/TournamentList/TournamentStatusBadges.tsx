import { Badge, BadgeDelta, Flex } from "@tremor/react";
import { Tournament } from "../../../types/tournament";
import {
  MoonIcon,
  StatusOnlineIcon
} from "@heroicons/react/outline";
import { formatTournamentStatus } from "./helpers";
import { useUtcOffset } from "../../hooks/tournamentMetadata";
import { getRoundText } from "../Tournament/helpers";

interface TournamentStatusBadgesProps {
  tournament: Tournament;
  hasVagueTime?: boolean;
}

export const TournamentStatusBadges = (props: TournamentStatusBadgesProps) => {
  const utcOffset = useUtcOffset(props.tournament);

  return props.tournament.tournamentStatus === 'not-started' ? (
        <Badge className="dark:bg-gray-800 dark:text-gray-400" color='gray'>{props.hasVagueTime ? 'Upcoming' : formatTournamentStatus(props.tournament, utcOffset)}</Badge>
      ) : props.tournament.tournamentStatus === 'running' ? (
        <Badge size='xs' icon={StatusOnlineIcon}>{getRoundText(props.tournament)}</Badge>
      ) : null
}