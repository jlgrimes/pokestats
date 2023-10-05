import { Stack } from '@chakra-ui/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { TournamentPriorHelper } from '../../src/components/Tournament/TournamentPriorHelper';
import { TournamentList } from '../../src/components/TournamentList/TournamentList';
import {
  fetchTournaments,
} from '../../src/hooks/tournaments';
import { Tournament } from '../../types/tournament';

export default function TournamentPage({
  tournaments,
}: {
  tournaments: Tournament[];
}) {
  return (
    <Stack>
      <TournamentList tournaments={tournaments} />
      <TournamentPriorHelper />
    </Stack>
  );
}

export async function getStaticProps() {
  const tournaments = await fetchTournaments({ prefetch: true });
  const queryClient = new QueryClient();

  return {
    props: {
      tournaments,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}
