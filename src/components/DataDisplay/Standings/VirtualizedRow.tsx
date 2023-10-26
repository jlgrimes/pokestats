import { Box, Divider } from '@chakra-ui/react';
import { memo, useContext } from 'react';
import { Standing, Tournament } from '../../../../types/tournament';
import { PlayerCard } from '../../Tournament/Home/PlayerCard/PlayerCard';
import { StandingsRowExpandable } from './StandingsRowExpandable';
import { StandingsPageContext } from '../../../../pages/tournaments/[id]/[division]/standings';

interface VirtualizedRowProps {
  index: number;
  standing: Standing;
  tournament: Tournament;
  canEditDecks: boolean;
  shouldHideDeck: boolean;
}

export const VirtualizedRow = memo((props: VirtualizedRowProps) => {
  const { shouldShowMatchPoints } = useContext(StandingsPageContext)
  return (
    <PlayerCard
      player={props.standing}
      tournament={props.tournament}
      canEditDecks={props.canEditDecks}
      size='sm'
      shouldHideOpponent
      shouldShowMatchPoints={shouldShowMatchPoints}
    />
  );
});

VirtualizedRow.displayName = 'Virtualized Row';
