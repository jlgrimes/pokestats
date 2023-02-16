import { memo, useState } from 'react';
import { OpponentRoundList } from './OpponentRoundList';
import { StandingsRow, StandingsRowProps } from './StandingsRow';

export const StandingsRowExpandable = memo((props: StandingsRowProps) => {
  const [showOpponentRecords, setShowOpponentRecords] = useState(false);
  return (
    <>
      <StandingsRow
        {...props}
        rowExpanded={showOpponentRecords}
        toggleRowExpanded={() => setShowOpponentRecords(true)}
      />
    </>
  );
});

StandingsRowExpandable.displayName = 'StandingsRowExpandable';
