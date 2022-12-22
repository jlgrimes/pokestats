import { Heading, Stack } from '@chakra-ui/react';
import { ArchetypeGraph } from '../../../src/components/Tournament/Stats/ArchetypeGraph';
import { TournamentTabs } from '../../../src/components/Tournament/TournamentTabs';

export default function StatsPage() {
  return (
    <Stack>
      <TournamentTabs />
      <ArchetypeGraph />
    </Stack>
  );
}
