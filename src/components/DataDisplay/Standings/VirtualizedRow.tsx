import { Box, Divider } from '@chakra-ui/react';
import { memo } from 'react';
import { Standing, Tournament } from '../../../../types/tournament';
import { PlayerCard } from '../../Tournament/Home/PlayerCard/PlayerCard';
import { StandingsRowExpandable } from './StandingsRowExpandable';

interface VirtualizedRowProps {
  index: number;
  standing: Standing;
  tournament: Tournament;
  canEditDecks: boolean;
  shouldHideDeck: boolean;
}

export const VirtualizedRow = memo((props: VirtualizedRowProps) => {
  return (
    <PlayerCard
      player={props.standing}
      tournament={props.tournament}
      canEditDecks={props.canEditDecks}
      size='sm'
      shouldHideOpponent
    />
  );
});

VirtualizedRow.displayName = 'Virtualized Row';
