import { Heading, Stack } from '@chakra-ui/react';
import { PairingRound } from '../../../../types/pairings';
import { PairingsCard } from './PairingsCard';

export const PairingsView = () => {
  const pairings: PairingRound = {
    round: 2,
    tables: [{
      table: 1,
      players: ['Jared Grimes', 'Tord Reklev']
    }],
  };

  return (
    <Stack paddingX={4}>
      <Heading size='md'>{`Round ${pairings.round} pairings`}</Heading>
      <Stack>
        {pairings.tables.map(pairing => (
          <PairingsCard key={pairing.table} pairing={pairing} />
        ))}
      </Stack>
    </Stack>
  );
};
