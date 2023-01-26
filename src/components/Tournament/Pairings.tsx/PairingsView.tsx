import { Heading, Stack } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { PairingRound } from '../../../../types/pairings';
import { Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { usePairingSubmissions } from '../../../hooks/pairings';
import { PairingsCard } from './PairingsCard';
import { SubmissionUpdateLog } from './Submissions/SubmissionUpdateLog';

export const PairingsView = ({ tournament }: { tournament: Tournament }) => {
  const pairings: PairingRound = {
    round: 2,
    tables: [
      {
        table: 1,
        players: ['Jared Grimes', 'Tord Reklev'],
      },
    ],
  };

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
      <Heading size='md'>{`Round ${pairings.round} pairings`}</Heading>
      <SubmissionUpdateLog updates={updateLog} />
      <Stack>
        {pairings.tables.map(pairing => (
          <PairingsCard
            round={pairings.round}
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
