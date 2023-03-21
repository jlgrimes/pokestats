import { Text } from '@chakra-ui/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FullPageLoader } from '../../src/components/common/FullPageLoader';
import { PlayerProfilePage } from '../../src/components/Profile/PlayerProfilePage';
import { fetchFinalResults } from '../../src/hooks/finalResults/fetch';
import { fetchTournamentMetadata } from '../../src/hooks/tournamentMetadata';
import { fetchTournaments } from '../../src/hooks/tournaments';
import {
  fetchAllTakenUsernames,
  usePlayerProfile,
  fetchPlayerProfile,
} from '../../src/hooks/user';

export default function Page({ username }: { username: string }) {
  const router = useRouter();
  const { data, isLoading } = usePlayerProfile({ username });

  if (router.isFallback || isLoading) return <FullPageLoader />;

  if (!isLoading && !data)
    return (
      <Text>
        No user found with username {username}. Sure you got the right one?
      </Text>
    );

  if (!data) return <Text>Something went wrong.</Text>;

  return (
    <div>
      <Head>
        <title>{username} - PokéStats Live</title>
        <meta property='og:type' content='website' />
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@pokestatstcg' />
        <meta
          name='twitter:title'
          content={`Follow ${username} on PokéStats Live`}
        />
        <meta
          name='twitter:image'
          content='https://keujidcnlmekgfajgnjq.supabase.co/storage/v1/object/sign/images/live.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJpbWFnZXMvbGl2ZS5wbmciLCJpYXQiOjE2NzkzNTQ2MjUsImV4cCI6MTcxMDg5MDYyNX0.2Aq8Ayu5MAeYAWbbxd99jBVj9VWSFIRflWvV-GTbfIk&t=2023-03-20T23%3A23%3A45.653Z'
        />
        {/* <meta
          name='twitter:description'
          content={`View ${username}'s player profile on PokéStats Live.`}
        />
         */}
      </Head>
      <PlayerProfilePage profile={data} />
    </div>
  );
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['tournaments'],
    queryFn: () => fetchTournaments({ prefetch: true }),
  });

  await queryClient.prefetchQuery({
    queryKey: ['all-tournament-metadata'],
    queryFn: () => fetchTournamentMetadata(),
  });

  const playerProfile = await fetchPlayerProfile({ username: params.id });

  await queryClient.setQueryData(
    ['player-profile', params.id, null],
    () => playerProfile
  );
  await queryClient.setQueryData(
    ['player-profile', null, playerProfile?.name],
    () => playerProfile
  );

  if (playerProfile?.name) {
    await queryClient.prefetchQuery({
      queryKey: [
        'final-results',
        {
          playerName: playerProfile.name,
        },
      ],
      queryFn: () => fetchFinalResults({ playerName: playerProfile.name }),
    });
  }

  return {
    props: {
      username: params.id,
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  const users = await fetchAllTakenUsernames();
  const paths = users?.map(username => ({ params: { id: username.toLowerCase() } }));

  return {
    paths,
    fallback: true, // can also be true or 'blocking'
  };
}
