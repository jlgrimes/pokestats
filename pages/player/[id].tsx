import { Text } from '@chakra-ui/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import Head from 'next/head';
import { FullPageLoader } from '../../src/components/common/FullPageLoader';
import { PlayerProfilePage } from '../../src/components/Profile/PlayerProfilePage';
import { fetchTournaments } from '../../src/hooks/tournaments';
import {
  fetchAllTakenUsernames,
  usePlayerProfile,
  fetchPlayerProfile,
} from '../../src/hooks/user';

export default function Page({ username }: { username: string }) {
  const { data, isLoading } = usePlayerProfile({ username });

  if (isLoading) return <FullPageLoader />;

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
        {/* <meta
          name='twitter:description'
          content={`View ${username}'s player profile on PokéStats Live.`}
        />
        <meta
          name='twitter:image'
          content='http://1.bp.blogspot.com/-RqEPz32fWg0/XYveSw2AQbI/AAAAAAAAPtY/HQ9ivK9BRSQTT433qkQ9Pq4RypyIj2UUgCK4BGAYYCw/s1218/4.jpg'
        /> */}
      </Head>
      <PlayerProfilePage profile={data} />
    </div>
  );
}

export const getStaticProps = async ({
  params,
}: {
  params: { id: string };
}) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['tournaments'],
    queryFn: () => fetchTournaments({ prefetch: true }),
  });

  const playerProfile = await fetchPlayerProfile({ username: params.id });

  queryClient.setQueryData(
    ['player-profile', params.id, null],
    () => playerProfile
  );
  queryClient.setQueryData(
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
    });
  }

  return {
    props: {
      username: params.id,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export async function getStaticPaths() {
  const users = await fetchAllTakenUsernames();
  const paths = users?.map(username => ({ params: { id: username } }));

  return {
    paths,
    fallback: false, // can also be true or 'blocking'
  };
}
