import { Heading, Stack } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
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
  const [round, setRound] = useState(roundNumber);
  const { data: pairingsData } = usePairings(tournament.id, {
    roundNumber: round,
  });

  useEffect(() => {
    setRound(pairingsData?.round);
  }, [pairingsData?.round]);

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

  return (
    <Stack paddingX={4}>
      {round && pairingsData && (
        <RoundTabs
          round={round}
          setRound={setRound}
          maxRound={pairingsData?.maxRound}
        />
      )}
      <Heading size='md'>{`Round ${round} pairings`}</Heading>
      {updateLog.length > 0 && <SubmissionUpdateLog updates={updateLog} />}
      <Stack>
        {round && pairingsData?.tables?.map(pairing => (
          <PairingsCard
            round={round}
            key={pairing.table}
            pairing={pairing}
            tournament={tournament}
            isUserAdmin={userIsAdmin}
            pairingSubmissions={pairingSubmissions}
            refetchData={refetch}
            addToUpdateLog={addToUpdateLog}
          />
        ))}
      </Stack>
    </Stack>
  );
};
