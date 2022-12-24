import { Stack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import Tournament from '../../../src/components/Tournament/Tournament';
import { TournamentPageLayout } from '../../../src/components/Tournament/TournamentPageLayout';
import { TournamentTabs } from '../../../src/components/Tournament/TournamentTabs';
import { useAdministrators } from '../../../src/hooks/administrators';
import supabase from '../../../src/lib/supabase/client';

export default function TournamentPage({
  tournament,
}: {
  tournament: { id: string; name: string };
}) {
  const { data: session } = useSession();
  const administrators = useAdministrators();
  const userIsAdmin =
    administrators.data?.some(admin => admin.email === session?.user?.email) ??
    false;

  return (
    <TournamentPageLayout tournament={tournament}>
      <Tournament tournament={tournament} allowEdits={userIsAdmin} />
    </TournamentPageLayout>
  );
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(`live-results-${params.id}`);
  await queryClient.prefetchQuery(`administrators`);
  await queryClient.prefetchQuery(`pokedex`);

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
