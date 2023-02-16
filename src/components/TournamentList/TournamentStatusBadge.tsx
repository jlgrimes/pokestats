import { Badge } from '@chakra-ui/react';
import { Tournament } from '../../../types/tournament';
import {
  formatTournamentStatus,
  getTournamentStatusBadgeProps,
} from './helpers';

interface TournamentStatusBadgeProps {
  tournament: Tournament;
  size: 'xs' | 'sm' | 'md' | 'lg';
}

export const TournamentStatusBadge = (props: TournamentStatusBadgeProps) => {
  return (
    <span>
      <Badge
        {...getTournamentStatusBadgeProps(props.tournament)}
        fontSize={props.size}
      >
        {formatTournamentStatus(props.tournament)}
      </Badge>
    </span>
  );
};
