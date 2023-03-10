import { memo, useState } from 'react';
import { OpponentRoundList } from './OpponentRoundList/OpponentRoundList';
import { StandingsRow, StandingsRowProps } from './StandingsRow';

export const StandingsRowExpandable = memo((props: StandingsRowProps) => {
  const [showOpponentRecords, setShowOpponentRecords] = useState(false);
  return (
    <>
      <StandingsRow {...props} rowExpanded={showOpponentRecords} />
    </>
  );
});

StandingsRowExpandable.displayName = 'StandingsRowExpandable';
