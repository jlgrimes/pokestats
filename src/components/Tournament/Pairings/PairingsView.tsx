import { Box, Heading, Stack } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import ReactVirtualizedAutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import { Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { usePairings, usePairingSubmissions } from '../../../hooks/pairings';
import { PairingsCard } from './PairingsCard';
import { RoundTabs } from './RoundTabs';
import { SubmissionUpdateLog } from './Submissions/SubmissionUpdateLog';

export const PairingsView = ({
  tournament,
  roundNumber,
}: {
  tournament: Tournament;
  roundNumber?: number;
}) => {
  const [round, setRound] = useState<number>();
  const { data: pairingsData } = usePairings(tournament.id, {
    roundNumber: round,
  });

  useEffect(() => {
    pairingsData.round && setRound(pairingsData.round);
  }, [pairingsData.round]);

  const { data: userIsAdmin } = useUserIsAdmin();
  const { data: pairingSubmissions, refetch } = usePairingSubmissions(
    tournament.id
  );
  const [updateLog, setUpdateLog] = useState<string[]>([]);

  const addToUpdateLog = useCallback(
    (name: string) => {
      setUpdateLog([...updateLog, name]);
    },
    [setUpdateLog, updateLog]
  );

  const VirtualizedRow = ({ index, style }: { index: number; style: any }) => (
    <Stack style={style}>
      <PairingsCard
        round={round as number}
        key={`pairing-${index}`}
        pairing={pairingsData.tables![index]}
        tournament={tournament}
        isUserAdmin={userIsAdmin}
        pairingSubmissions={pairingSubmissions}
        refetchData={refetch}
        addToUpdateLog={addToUpdateLog}
      />
    </Stack>
  );

  return (
    <Stack padding={4} height='100%'>
      {round && pairingsData && (
        <RoundTabs
          round={round}
          setRound={setRound}
          maxRound={pairingsData.maxRound as number}
        />
      )}
      <Box flexGrow={1}>
        {round && pairingsData.tables && (
        <ReactVirtualizedAutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              width={width}
              itemSize={userIsAdmin ? 130 : 100}
              itemCount={pairingsData.tables!.length}
            >
              {VirtualizedRow}
            </FixedSizeList>
          )}
        </ReactVirtualizedAutoSizer>
      )}
      </Box>
    </Stack>
  );
};
