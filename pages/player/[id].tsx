import {
  Avatar,
  Heading,
  Stack,
  Text,
  Link,
  Button,
  Icon,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useSession } from 'next-auth/react';
import { FaTwitter } from 'react-icons/fa';
import { useUserIsAdmin } from '../../src/hooks/administrators';
import { useTwitterLink } from '../../src/hooks/twitter';
import { CombinedPlayerProfile } from '../../types/player';
import supabase from '../../src/lib/supabase/client';
import { ComplainLink } from '../../src/components/common/ComplainLink';
import { useRouter } from 'next/router';
import { PlayerPerformanceList } from '../../src/components/DataDisplay/PlayerPerformanceList';
import { useEffect } from 'react';
import { ProfileNotFound } from '../../src/components/Profile/ProfileNotFound';
import {
  fetchUserProfile,
  useUserMatchesLoggedInUser,
} from '../../src/hooks/user';

function PlayerPage({ user }: { user: CombinedPlayerProfile | null }) {
  const twitterLink = useTwitterLink(user?.username);
  const userOwnsPage = useUserMatchesLoggedInUser(user?.name ?? '');

  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    // If user is on the page with their profile, and there is not a profile stored
    if (session.data?.user.username === router.query.id && !user) {
      router.push('/setup-profile');
    }
  }, [session.data?.user.username, router, user]);

  if (!user) {
    return <ProfileNotFound />;
  }

  return (
    <>
      <Stack padding='1.5rem 0' spacing={6}>
        <Stack spacing={4} alignItems={'center'} padding='0 1.5rem'>
          <Avatar
            size={'xl'}
            name={user?.name ?? undefined}
            src={user?.profile_image_url ?? undefined}
          />
          <Stack alignItems={'center'} spacing={1}>
            <Stack direction={'row'} alignItems='center'>
              <Heading color='gray.700'>{user?.name}</Heading>
              <Link
                color='twitter.500'
                as={NextLink}
                href={twitterLink}
                isExternal
              >
                <Icon as={FaTwitter} />
              </Link>
            </Stack>
            <Text textAlign={'center'} fontSize='sm'>{user.description}</Text>
          </Stack>
        </Stack>
        <PlayerPerformanceList user={user} />
      </Stack>
    </>
  );
}

export async function getStaticProps(context: any) {
  const username = context.params?.id.toLowerCase();
  const combinedProfile = await fetchUserProfile(username, { prefetch: true });

  return {
    props: {
      user: combinedProfile,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const { data: playerProfiles } = await supabase
    .from('Player Profiles')
    .select('id,name,twitter_handle,tournament_history')
    .neq('twitter_handle', null);

  const paths = playerProfiles?.map(
    player => ({
      params: {
        id: player.twitter_handle,
      },
    }),
    []
  );

  return {
    paths,
    fallback: 'blocking',
  };
}

export default PlayerPage;
