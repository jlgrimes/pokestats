import { Stack } from '@chakra-ui/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { MyMatchupsList } from '../../../src/components/DataDisplay/MyMatchupsList';
import { LoggedInPlayerStatus } from '../../../src/components/Tournament/Results/LoggedInPlayerStatus';
import { TournamentPageLayout } from '../../../src/components/Tournament/TournamentPageLayout';
import { useLiveTournamentResults } from '../../../src/hooks/tournamentResults';
import { fetchLiveResults } from '../../../src/lib/fetch/fetchLiveResults';
import supabase from '../../../src/lib/supabase/client';

export default function MyMatchups({
  tournament,
}: {
  tournament: { id: string; name: string };
}) {
  const { data: liveResults } = useLiveTournamentResults(tournament?.id, {
    load: { roundData: true },
  });

  return (
    <TournamentPageLayout tournament={tournament}>
      <Stack padding='1rem 1.5rem'>
        <LoggedInPlayerStatus
          tournament={tournament}
          tournamentFinished={!liveResults?.live}
        />
        <MyMatchupsList tournament={tournament} />
      </Stack>
    </TournamentPageLayout>
  );
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    [`live-results-${params.id}`, 'roundData'],
    () =>
      fetchLiveResults(params.id, { prefetch: true, load: { roundData: true } })
  );

  const { data: tournaments } = await supabase
    .from('Tournaments')
    .select('id,name');

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
  const { data: tournaments } = await supabase
    .from('Tournaments')
    .select('id,name');
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
