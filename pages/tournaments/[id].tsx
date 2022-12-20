import { dehydrate, QueryClient } from 'react-query';
import Tournament from '../../src/components/Tournament/Tournament';
import supabase from '../../src/lib/supabase/client';

export default function TournamentPage({
  tournament,
}: {
  tournament: { id: string; name: string };
}) {
  return <Tournament tournament={tournament} allowEdits={false} />;
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(`live-results-${params.id}`);

  return {
    props: {
      tournament: params,
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
