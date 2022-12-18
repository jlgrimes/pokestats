import { Heading, Stack } from '@chakra-ui/react';
import NotablePlayers from '../NotablePlayers/NotablePlayers';
import Results from '../Results/Results';

export default function Tournament({
  tournament,
  allowEdits,
}: {
  tournament: { id: string; name: string };
  allowEdits: boolean;
}) {
  return (
    <Stack>
      <Heading>{tournament.name}</Heading>
      {/* <NotablePlayers tournament={tournament.name} allowEdits={allowEdits} /> */}
      <Results tournament={tournament} allowEdits={allowEdits} />
    </Stack>
  );
}
