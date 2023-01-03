import { dehydrate, QueryClient } from '@tanstack/react-query';
import { ArchetypeGraphsContainer } from '../../../src/components/Tournament/Stats/ArchetypeGraphsContainer';
import { TournamentPageLayout } from '../../../src/components/Tournament/TournamentPageLayout';
import { useLiveTournamentResults } from '../../../src/hooks/tournamentResults';
import { fetchTournaments } from '../../../src/hooks/tournaments';
import { fetchLiveResults } from '../../../src/lib/fetch/fetchLiveResults';
import { Tournament } from '../../../types/tournament';

export default function StatsPage({
  tournament,
}: {
  tournament: Tournament;
}) {
  const { data: liveResults } = useLiveTournamentResults(
    tournament.id as string
  );

  return (
    <TournamentPageLayout tournament={tournament}>
      {/* <TournamentDetails tournament={tournament} /> */}
      {!liveResults?.live && (
        <ArchetypeGraphsContainer tournament={tournament} />
      )}
    </TournamentPageLayout>
  );
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([`live-results-${params.id}`], () =>
    fetchLiveResults(params.id, { prefetch: true })
  );

  const tournaments = await fetchTournaments({ prefetch: true });

  return {
    props: {
      tournament: {
        id: params.id,
        name: tournaments?.find(({ id }) => id === params.id)?.name,
      },
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const tournaments = await fetchTournaments({ prefetch: true });
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
