import { Heading, Stack } from '@chakra-ui/react';
import { PairingRound } from '../../../../types/pairings';
import { Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { usePairingSubmissions } from '../../../hooks/pairings';
import { PairingsCard } from './PairingsCard';

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
  const { data: pairingSubmissions, refetch } = usePairingSubmissions(tournament.id);

  return (
    <Stack paddingX={4}>
      <Heading size='md'>{`Round ${pairings.round} pairings`}</Heading>
      <Stack>
        {pairings.tables.map(pairing => (
          <PairingsCard
            round={pairings.round}
            key={pairing.table}
            pairing={pairing}
            tournament={tournament}
            isUserAdmin={userIsAdmin}
            currentRoundPairingMatches={pairingSubmissions?.filter(
              submission =>
                submission.round_number === pairings.round &&
                submission.table_number === pairing.table
            )}
            potentialPairingMatches={pairingSubmissions?.filter(
              submission =>
                submission.player1_name === pairing.players[0] ||
                submission.player2_name === pairing.players[0] ||
                submission.player1_name === pairing.players[1] ||
                submission.player2_name === pairing.players[1]
            )}
            refetchData={refetch}
          />
        ))}
      </Stack>
    </Stack>
  );
};
