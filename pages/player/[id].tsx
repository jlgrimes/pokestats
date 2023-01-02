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
import { signOut, useSession } from 'next-auth/react';
import { FaSignOutAlt, FaTwitter } from 'react-icons/fa';
import { useUserIsAdmin } from '../../src/hooks/administrators';
import { fetchPlayerProfiles } from '../../src/lib/fetch/fetchLiveResults';
import { fetchServerSideTwitterProfile } from '../api/get-twitter-profile';
import { useTwitterLink } from '../../src/hooks/twitter';
import {
  CombinedPlayerProfile,
  StoredPlayerProfile,
  TwitterPlayerProfile,
} from '../../types/player';
import supabase from '../../src/lib/supabase/client';
import { ComplainLink } from '../../src/components/common/ComplainLink';
import { useRouter } from 'next/router';
import { PlayerPerformanceList } from '../../src/components/DataDisplay/PlayerPerformanceList';
import { useEffect } from 'react';
import { ProfileNotFound } from '../../src/components/Profile/ProfileNotFound';
import { useUserMatchesLoggedInUser } from '../../src/hooks/user';

function PlayerPage({ user }: { user: CombinedPlayerProfile | null }) {
  const userIsAdmin = useUserIsAdmin();
  const twitterLink = useTwitterLink(user?.username);
  const userOwnsPage = useUserMatchesLoggedInUser(user?.name ?? '');

  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    // If user is on the page with their profile, and there is not a profile stored
    if (session.data?.user.username === router.query.id && !user) {
      router.push('/profile-setup');
    }
  }, [session.data?.user.username, router, user]);

  if (!user) {
    return <ProfileNotFound />;
  }

  return (
    <>
      <Stack padding='1.5rem 1.5rem' spacing={6}>
        <Stack spacing={4} alignItems={'center'}>
          <Avatar
            size={'xl'}
            name={user?.name ?? undefined}
            src={user?.profile_image_url ?? undefined}
          />
          <Stack spacing={0} alignItems={'center'}>
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
            <Text>{user.description}</Text>
          </Stack>
        </Stack>
        {userOwnsPage && (
          <Stack>
            {userIsAdmin && (
              <Heading size={'sm'} fontWeight='semibold'>
                You are a site admin!
              </Heading>
            )}
            <Button
              variant='outline'
              aria-label={'Log out'}
              rightIcon={<FaSignOutAlt />}
              onClick={() => signOut()}
            >
              Log out
            </Button>
          </Stack>
        )}
        <PlayerPerformanceList user={user} />
      </Stack>
    </>
  );
}

export async function getStaticProps(context: any) {
  const username = context.params?.id.toLowerCase();

  const playerProfiles: Record<string, StoredPlayerProfile> | undefined =
    await fetchPlayerProfiles('twitter_handle');
  const twitterProfile: TwitterPlayerProfile | undefined =
    await fetchServerSideTwitterProfile({ username });
  const playerProfile = playerProfiles?.[username];

  let combinedProfile: CombinedPlayerProfile | null = null;

  if (playerProfile && twitterProfile) {
    combinedProfile = {
      id: playerProfile?.id as string,
      name: playerProfile?.name as string,
      tournamentHistory: playerProfile?.tournamentHistory as string[],
      username: twitterProfile?.username as string,
      description: twitterProfile?.description as string,
      profile_image_url: twitterProfile?.profile_image_url as string,
    };
  }

  return {
    props: {
      user: combinedProfile,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths(id: string) {
  const { data: playerProfiles } = await supabase
    .from('Player Profiles')
    .select('id,name,twitter_handle,tournament_history');

  const paths = playerProfiles?.reduce((acc: any[], player) => {
    if (player.twitter_handle) {
      return [
        ...acc,
        {
          params: {
            id: player.twitter_handle,
          },
        },
      ];
    }

    return acc;
  }, []);

  return {
    paths,
    fallback: 'blocking',
  };
}

export default PlayerPage;
