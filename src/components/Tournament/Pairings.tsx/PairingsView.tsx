import { Heading, Stack } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { usePairings, usePairingSubmissions } from '../../../hooks/pairings';
import { PairingsCard } from './PairingsCard';
import { SubmissionUpdateLog } from './Submissions/SubmissionUpdateLog';

export const PairingsView = ({ tournament }: { tournament: Tournament }) => {
  const round = 2;
  const { data: pairings } = usePairings(tournament.id, { roundNumber: round });

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
      <Heading size='md'>{`Round ${round} pairings`}</Heading>
      {updateLog.length > 0 && <SubmissionUpdateLog updates={updateLog} />}
      <Stack>
        {pairings?.map(pairing => (
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
