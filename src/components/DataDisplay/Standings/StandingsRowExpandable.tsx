import { Stack } from '@chakra-ui/react';
import { memo, useState } from 'react';
import { StandingsRow, StandingsRowProps } from './StandingsRow';

export const StandingsRowExpandable = memo((props: StandingsRowProps) => {
  const [showOpponentRecords, setShowOpponentRecords] = useState(false);
  return (
    <>
      <StandingsRow
        {...props}
        rowExpanded={showOpponentRecords}
        toggleRowExpanded={() => setShowOpponentRecords(!showOpponentRecords)}
      />
      {showOpponentRecords && <div>hi</div>}
    </>
  );
});

StandingsRowExpandable.displayName = 'StandingsRowExpandable';
