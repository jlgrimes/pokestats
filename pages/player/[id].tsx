import { Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { FullPageLoader } from '../../src/components/common/FullPageLoader';
import { PlayerPerformanceList } from '../../src/components/DataDisplay/PlayerPerformanceList';
import { FollowButton } from '../../src/components/Social/FollowButton';
import { usePlayerProfile } from '../../src/hooks/user';

export default function Page({ username }: { username: string }) {
  const { data, isLoading } = usePlayerProfile(username);

  if (isLoading) return <FullPageLoader />;

  if (!isLoading && !data)
    return (
      <Text>
        No user found with username {username}. Sure you got the right one?
      </Text>
    );

  if (!data) return <Text>Something went wrong.</Text>;

  return (
    <Stack>
      <Stack spacing={0} alignItems='center'>
        <Heading>{data.name}</Heading>
        <HStack>
          <Heading
            size='lg'
            color='gray.500'
            fontWeight='semibold'
          >{`@${username}`}</Heading>
          <FollowButton playerName={data.name} />
        </HStack>
      </Stack>
      <PlayerPerformanceList user={data} />
    </Stack>
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
