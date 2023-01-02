import {
  Avatar,
  Heading,
  Stack,
  Text,
  Link,
  Button,
  Icon,
} from '@chakra-ui/react';
import { QueryClient } from '@tanstack/react-query';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useTournaments } from '../src/hooks/tournaments';
import {
  fetchSessionUserProfile,
  fetchSuggestedUserProfile,
  useSessionUserProfile,
  useSuggestedUserProfile,
} from '../src/hooks/user';

export default function SetupPage() {
  const session = useSession();
  const router = useRouter();
  const { data: tournaments } = useTournaments();
  const { data: user } = useSessionUserProfile();
  const { data: suggestedUser } = useSuggestedUserProfile();

  useEffect(() => {
    if (user) {
      router.push(`/player/${user.username}`);
    }
  }, [router, user]);

  const firstName = useMemo(
    () => session.data?.user.name?.split(' ')?.[0],
    [session.data?.user.name]
  );

  const attendedTournaments = useMemo(
    () =>
      suggestedUser?.tournamentHistory.map(
        id => tournaments?.data?.find(tournament => tournament.id === id)?.name
      ),
    [suggestedUser?.tournamentHistory, tournaments?.data]
  );

  return (
    <Stack padding='1.5rem' spacing={8}>
      <Heading color='gray.700'>{`Let's set up your profile, ${firstName}`}</Heading>
      <Text fontSize={'lg'}>{`Did you attend ${attendedTournaments?.join(
        ', '
      )}?`}</Text>
      <Stack direction={{ base: 'column', sm: 'row' }}>
        <Button
          variant='solid'
          colorScheme='green'
          leftIcon={<FaCheck />}
          onClick={() => console.log('hi')}
        >
          {`Yes I did`}
        </Button>
        <Button
          variant='outline'
          colorScheme='gray'
          onClick={() => console.log('hi')}
        >
          {`No I did not`}
        </Button>
      </Stack>
    </Stack>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  console.log(session)

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([`session-user-profile`], () =>
    fetchSessionUserProfile(session, { prefetch: true })
  );
  await queryClient.prefetchQuery(
    [`suggested-user-profile`, session?.user.name],
    () => fetchSuggestedUserProfile(session?.user.name ?? '')
  );

  return {
    props: {},
  };
}
