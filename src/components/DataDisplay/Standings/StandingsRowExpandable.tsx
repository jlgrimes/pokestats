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
      {showOpponentRecords && props.result.rounds && (
        <OpponentRoundList
          player={props.result}
          tournament={props.tournament}
          modalOpen={showOpponentRecords}
          handleCloseModal={() => setShowOpponentRecords(false)}
        />
      )}
    </>
  );
});

StandingsRowExpandable.displayName = 'StandingsRowExpandable';
