import { Badge, Box, HStack, Text } from '@chakra-ui/react';
import { Tournament } from '../../../types/tournament';
import { useUtcOffset } from '../../hooks/tournamentMetadata';
import {
  formatTournamentStatus,
  getTournamentStatusBadgeProps,
} from './helpers';
import { TournamentFormatBadges } from './TournamentFormatBadges';

export interface TournamentStatusBadgeProps {
  tournament: Tournament;
  size: 'xs' | 'sm' | 'md' | 'lg';
}

export const TournamentStatusBadge = (props: TournamentStatusBadgeProps) => {
  const utcOffset = useUtcOffset(props.tournament.id);

  if (props.tournament.tournamentStatus === 'finished')
    return (
      <TournamentFormatBadges tournament={props.tournament} size={props.size} />
    );

  return (
    <span>
      <Badge
        {...getTournamentStatusBadgeProps(props.tournament)}
        fontSize={props.size}
      >
        <HStack>
          <Text>{formatTournamentStatus(props.tournament, utcOffset)}</Text>
        </HStack>
      </Badge>
    </span>
  );
};
