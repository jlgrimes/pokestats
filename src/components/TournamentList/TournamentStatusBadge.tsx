import { Badge } from '@chakra-ui/react';
import { Tournament } from '../../../types/tournament';
import { useUtcOffset } from '../../hooks/tournamentMetadata';
import {
  formatTournamentStatus,
  getTournamentStatusBadgeProps,
} from './helpers';

interface TournamentStatusBadgeProps {
  tournament: Tournament;
  size: 'xs' | 'sm' | 'md' | 'lg';
}

export const TournamentStatusBadge = (props: TournamentStatusBadgeProps) => {
  const utcOffset = useUtcOffset(props.tournament.id);

  return (
    <span>
      <Badge
        {...getTournamentStatusBadgeProps(props.tournament)}
        fontSize={props.size}
      >
        {formatTournamentStatus(props.tournament, utcOffset)}
      </Badge>
    </span>
  );
};
