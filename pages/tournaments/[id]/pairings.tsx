import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ArchetypeGraphsContainer } from '../../../src/components/Tournament/Stats/ArchetypeGraphsContainer';
import { TournamentPageLayout } from '../../../src/components/Tournament/TournamentPageLayout';
import { useLiveTournamentResults } from '../../../src/hooks/tournamentResults';
import {
  fetchCurrentTournamentInfo,
  fetchTournaments,
} from '../../../src/hooks/tournaments';
import { fetchLiveResults } from '../../../src/lib/fetch/fetchLiveResults';
import { Tournament } from '../../../types/tournament';

export default function StatsPage({ tournament }: { tournament: Tournament }) {
  return (
    <TournamentPageLayout tournament={tournament}>
      <div>pairings coming soon</div>
    </TournamentPageLayout>
  );
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([`live-results`, params.id], () =>
    fetchLiveResults(params.id, { prefetch: true })
  );

  const tournament = await fetchCurrentTournamentInfo(params.id, {
    prefetch: true,
  });

  return {
    props: {
      tournament,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const tournaments = await fetchTournaments({ prefetch: true, excludeUpcoming: true });
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
