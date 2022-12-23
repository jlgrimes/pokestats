import { Heading, Stack } from '@chakra-ui/react';
import { dehydrate, QueryClient } from 'react-query';
import { ArchetypeGraph } from '../../../src/components/Tournament/Stats/ArchetypeGraph';
import { TournamentPageLayout } from '../../../src/components/Tournament/TournamentPageLayout';
import { TournamentTabs } from '../../../src/components/Tournament/TournamentTabs';
import supabase from '../../../src/lib/supabase/client';

export default function StatsPage({
  tournament,
}: {
  tournament: { id: string; name: string };
}) {
  return (
    <TournamentPageLayout tournament={tournament}>
      <ArchetypeGraph tournament={tournament} />
    </TournamentPageLayout>
  );
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(`live-results-${params.id}`);

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
