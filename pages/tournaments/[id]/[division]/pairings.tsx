import { dehydrate, QueryClient } from '@tanstack/react-query';
import { PairingsView } from '../../../../src/components/Tournament/Pairings/PairingsView';
import { TournamentPageLayout } from '../../../../src/components/Tournament/TournamentPageLayout';
import { fetchTournaments } from '../../../../src/hooks/tournaments';
import { fetchLiveResults } from '../../../../src/lib/fetch/fetchLiveResults';
import { Tournament } from '../../../../types/tournament';

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
  const paths = tournaments?.map(tournament => {
    return {
      params: {
        id: tournament.id,
        displayName: tournament.name,
      },
    };
  });

  let pathsWithDivisions: any[] = [];
  for (const division of ['masters', 'seniors', 'juniors']) {
    pathsWithDivisions = [...pathsWithDivisions, ...paths.map((path) => ({ params: { ...path.params, division }}))]
  }

  return {
    paths: pathsWithDivisions,
    fallback: 'blocking',
  };
}
