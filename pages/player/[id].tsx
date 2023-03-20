import { Text } from '@chakra-ui/react';
import Head from 'next/head';
import { FullPageLoader } from '../../src/components/common/FullPageLoader';
import { PlayerProfilePage } from '../../src/components/Profile/PlayerProfilePage';
import { usePlayerProfile } from '../../src/hooks/user';

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
    <>
      <Head>
        <title>{username} - PokéStats Live</title>
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@pokestatstcg' />
        <meta
          name='twitter:title'
          content={`Follow ${username} on PokéStats Live`}
        />
      </Head>
      <PlayerProfilePage profile={data} />
    </>
  );
}

export const getServerSideProps = (context: any) => {
  console.log(context.params.id);
  return {
    props: {
      username: context.params.id,
    },
  };
};
