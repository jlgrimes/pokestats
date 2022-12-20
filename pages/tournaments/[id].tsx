import { useSession } from "next-auth/react"
import { useEffect, useState } from 'react';
import { dehydrate, QueryClient } from 'react-query';
import Tournament from '../../src/components/Tournament/Tournament';
import { useAdministrators } from '../../src/hooks/administrators';
import supabase from '../../src/lib/supabase/client';

export default function TournamentPage({
  tournament,
}: {
  tournament: { id: string; name: string };
}) {
  const { data: session } = useSession();
  const administrators = useAdministrators();
  const userIsAdmin = administrators.data?.some(admin => admin.email === session?.user?.email) ?? false;

  return <Tournament tournament={tournament} allowEdits={userIsAdmin} />;
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(`live-results-${params.id}`);
  await queryClient.prefetchQuery(`administrators`);

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
