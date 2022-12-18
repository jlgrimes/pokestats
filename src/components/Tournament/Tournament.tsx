import { Heading, Stack, Text } from '@chakra-ui/react';
import NotablePlayers from './NotablePlayers/NotablePlayers';
import ResultsList from './Results/ResultsList/ResultsList';

export default function Tournament({
  tournament,
  allowEdits,
}: {
  tournament: { id: string; name: string };
  allowEdits: boolean;
}) {
  return (
    <Stack>
      <Stack padding={'1rem 3rem'} spacing={0}>
        <Heading>{tournament.name}</Heading>
        <Text>Live Standings</Text>
      </Stack>
      {/* <NotablePlayers tournament={tournament.name} allowEdits={allowEdits} /> */}
      <ResultsList tournament={tournament} allowEdits={allowEdits} />
    </Stack>
  );
}
