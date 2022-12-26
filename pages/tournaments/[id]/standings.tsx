import { dehydrate, QueryClient } from '@tanstack/react-query';
import Tournament from '../../../src/components/Tournament/Tournament';
import { TournamentPageLayout } from '../../../src/components/Tournament/TournamentPageLayout';
import { fetchAdministrators, useUserIsAdmin } from '../../../src/hooks/administrators';
import supabase from '../../../src/lib/supabase/client';
import { fetchLiveResults } from '../../../src/lib/fetch/fetchLiveResults';
import { fetchPokedex } from '../../../src/hooks/images';

export default function TournamentPage({
  tournament,
}: {
  tournament: { id: string; name: string };
}) {
  return (
    <TournamentPageLayout tournament={tournament}>
      <Tournament tournament={tournament} />
    </TournamentPageLayout>
  );
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([`live-results-${params.id}`], () =>
    fetchLiveResults(params.id, { prefetch: true })
  );
  await queryClient.prefetchQuery([`administrators`], fetchAdministrators);
  await queryClient.prefetchQuery([`pokedex`], fetchPokedex);

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
