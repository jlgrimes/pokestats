import { Box, Divider } from '@chakra-ui/react';
import { memo } from 'react';
import { Standing, Tournament } from '../../../../types/tournament';
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
      <Divider marginBottom={2} />
      <StandingsRowExpandable
        result={props.standing}
        tournament={props.tournament}
        canEditDecks={props.canEditDecks}
        shouldHideDeck={props.shouldHideDeck}
      />
    </Box>
  );
});

VirtualizedRow.displayName = 'Virtualized Row';
