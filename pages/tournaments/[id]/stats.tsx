import { Heading, Stack } from '@chakra-ui/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { ArchetypeGraph } from '../../../src/components/Tournament/Stats/ArchetypeGraph';
import { ArchetypeGraphsContainer } from '../../../src/components/Tournament/Stats/ArchetypeGraphsContainer';
import { TournamentDetails } from '../../../src/components/Tournament/Stats/TournamentDetails';
import { TournamentPageLayout } from '../../../src/components/Tournament/TournamentPageLayout';
import { TournamentTabs } from '../../../src/components/Tournament/TournamentTabs';
import { useLiveTournamentResults } from '../../../src/hooks/tournamentResults';
import { fetchTournaments } from '../../../src/hooks/tournaments';
import { fetchLiveResults } from '../../../src/lib/fetch/fetchLiveResults';
import supabase from '../../../src/lib/supabase/client';

export default function StatsPage({
  tournament,
}: {
  tournament: { id: string; name: string };
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

  const { data: tournaments } = await fetchTournaments();

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
  const { data: tournaments } = await fetchTournaments();
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
