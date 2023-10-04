import { Text } from '@chakra-ui/react';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { FullPageLoader } from '../../src/components/common/FullPageLoader';
import { PlayerProfilePage } from '../../src/components/Profile/PlayerProfilePage';
import { fetchTournamentMetadata } from '../../src/hooks/tournamentMetadata';
import { fetchTournaments } from '../../src/hooks/tournaments';
import {
  fetchAllTakenUsernames,
  fetchPlayerProfile,
  useSmartPlayerProfiles,
  useUserMatchesLoggedInUser,
} from '../../src/hooks/user';
import { fetchPlayerStandings } from '../../src/hooks/newStandings';

export default function Page({ username }: { username: string }) {
  const router = useRouter();
  const { data, isLoading } = useSmartPlayerProfiles({ username });
  const profile = data?.at(0);
  const userIsLoggedInUser = useUserMatchesLoggedInUser(profile?.name);

  if (router.isFallback || isLoading || !profile) return <FullPageLoader />;

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
      <PlayerProfilePage
        profile={profile}
        userIsLoggedInUser={userIsLoggedInUser}
      />
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

  const playerProfiles = await fetchPlayerProfile();

  await queryClient.setQueryData(['player-profiles'], () => playerProfiles);

  const playerProfile = playerProfiles?.find(
    ({ username }) => username === params.id
  );

  if (playerProfile?.name) {
    await queryClient.prefetchQuery({
      queryKey: [
        'player-standings',
        playerProfile.id,
        undefined,
        undefined
      ],
      queryFn: () =>
        fetchPlayerStandings(playerProfile)
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
  const paths = users?.map(username => ({
    params: { id: username.toLowerCase() },
  }));

  return {
    paths,
    fallback: true, // can also be true or 'blocking'
  };
}
