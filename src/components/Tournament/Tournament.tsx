import { Heading, Stack } from '@chakra-ui/react';
import NotablePlayers from '../NotablePlayers/NotablePlayers';
import Results from '../Results/Results';

export default function Tournament({ tournament, allowEdits }: { tournament: string, allowEdits: boolean }) {
  return (
    <Stack>
      <Heading>{tournament}</Heading>
      <NotablePlayers tournament={tournament} allowEdits={allowEdits} />
      <Results tournament={tournament} allowEdits={allowEdits} />
    </Stack>
  );
}
