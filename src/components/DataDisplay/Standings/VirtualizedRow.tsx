import { Box, Divider } from '@chakra-ui/react';
import { memo } from 'react';
import { Standing, Tournament } from '../../../../types/tournament';
import { PlayerCard } from '../../Tournament/Home/PlayerCard/PlayerCard';
import { StandingsRowExpandable } from './StandingsRowExpandable';

interface VirtualizedRowProps {
  index: number;
  style: any;
  standing: Standing;
  tournament: Tournament;
  canEditDecks: boolean;
  shouldHideDeck: boolean;
}

export const VirtualizedRow = memo((props: VirtualizedRowProps) => {
  return (
    <Box style={props.style}>
      <PlayerCard
        player={props.standing}
        tournament={props.tournament}
        shouldHideDecks={props.shouldHideDeck}
        canEditDecks={props.canEditDecks}
        size='sm'
        shouldHideOpponent
        isPlayerMeOrMyOpponent={false}
      />
    </Box>
  );
});

VirtualizedRow.displayName = 'Virtualized Row';
