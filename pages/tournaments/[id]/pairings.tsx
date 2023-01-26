import { dehydrate, QueryClient } from '@tanstack/react-query';
import { PairingsView } from '../../../src/components/Tournament/Pairings.tsx/PairingsView';
import { TournamentPageLayout } from '../../../src/components/Tournament/TournamentPageLayout';
import { fetchTournaments } from '../../../src/hooks/tournaments';
import { fetchLiveResults } from '../../../src/lib/fetch/fetchLiveResults';
import { Tournament } from '../../../types/tournament';

export default function StatsPage({ tournament }: { tournament: Tournament }) {
  return (
    <TournamentPageLayout tournament={tournament}>
      <PairingsView tournament={tournament} />
    </TournamentPageLayout>
  );
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();

  const [tournament] = await fetchTournaments({
    tournamentId: params.id,
    prefetch: true,
  });
  queryClient.setQueryData(['tournaments', params.id], () => tournament);

  return {
    props: {
      tournament,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const tournaments = await fetchTournaments({
    prefetch: true,
    excludeUpcoming: true,
  });
  const paths = tournaments?.map(tournament => ({
    params: {
      id: tournament.id,
      displayName: tournament.name,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}
