import {
  Avatar,
  Heading,
  Stack,
  Text,
  Link,
  Button,
  Icon,
} from '@chakra-ui/react';
import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useTournaments } from '../src/hooks/tournaments';
import { fetchPlayerProfiles } from '../src/lib/fetch/fetchLiveResults';
import {
  CombinedPlayerProfile,
  StoredPlayerProfile,
  TwitterPlayerProfile,
} from '../types/player';
import { fetchTwitterProfile } from './api/get-twitter-profile';

export default function SetupPage({
  user,
  suggestedUser,
}: {
  user: CombinedPlayerProfile | null;
  suggestedUser: StoredPlayerProfile | null;
  userIsOwnerOfPage: boolean;
}) {
  const session = useSession();
  const router = useRouter();
  const { data: tournaments } = useTournaments();

  useEffect(() => {
    if (user) {
      router.push(`/player/${user.username}`);
    }
  }, []);

  const firstName = session.data?.user.name?.split(' ')?.[0];
  const attendedTournaments = suggestedUser?.tournamentHistory.map(
    id => tournaments?.data?.find(tournament => tournament.id === id)?.name
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
  const username = session?.user.username ?? '';

  const playerProfiles: Record<string, StoredPlayerProfile> | undefined =
    await fetchPlayerProfiles('twitter_handle');
  const twitterProfile: TwitterPlayerProfile | undefined =
    await fetchTwitterProfile({ username });
  const playerProfile = playerProfiles?.[username];

  let combinedProfile: CombinedPlayerProfile | null = null;
  let suggestedProfile: StoredPlayerProfile | null = null;

  if (playerProfile && twitterProfile) {
    combinedProfile = {
      id: playerProfile?.id as string,
      name: playerProfile?.name as string,
      tournamentHistory: playerProfile?.tournamentHistory as string[],
      username: twitterProfile?.username as string,
      description: twitterProfile?.description as string,
      profile_image_url: twitterProfile?.profile_image_url as string,
    };
  } else if (twitterProfile) {
    const profilesByName: Record<string, StoredPlayerProfile> | undefined =
      await fetchPlayerProfiles('name');
    suggestedProfile = profilesByName?.[twitterProfile.name] ?? null;
  }

  return {
    props: {
      user: combinedProfile,
      suggestedUser: suggestedProfile,
    }
  };
}
