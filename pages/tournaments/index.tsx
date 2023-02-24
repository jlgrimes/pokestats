import { dehydrate, QueryClient } from '@tanstack/react-query';
import { TournamentList } from '../../src/components/TournamentList/TournamentList';
import { fetchFinalResults } from '../../src/hooks/finalResults/fetch';
import {
  fetchTournaments,
  usePatchedTournaments,
} from '../../src/hooks/tournaments';
import { Tournament } from '../../types/tournament';

export default function TournamentPage({
  tournaments,
}: {
  tournaments: Tournament[];
}) {
  const { data: patchedTournaments } = usePatchedTournaments(tournaments);

  return <TournamentList tournaments={patchedTournaments ?? tournaments} />;
}

export async function getStaticProps() {
  const tournaments = await fetchTournaments({ prefetch: true });
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [
      'final-results',
      {
        placing: 1,
      },
    ],
    queryFn: () => fetchFinalResults({ placing: 1 }),
  });

  return {
    props: {
      tournaments,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}
