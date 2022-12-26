import {
  Avatar,
  Heading,
  Stack,
  Text,
  Link,
  Button,
  Icon,
  IconButton,
  useDisclosure,
  TableContainer,
  Table,
  Tbody,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { getSession, signOut, useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { FaArrowRight, FaSignOutAlt, FaTwitter } from 'react-icons/fa';
import { useUserIsAdmin } from '../../src/hooks/administrators';
import { fetchPlayerProfiles } from '../../src/lib/fetch/fetchLiveResults';
import { isMobileDevice } from '../../src/lib/userAgent';
import { fetchTwitterProfile } from '../api/get-twitter-profile';
import { useTwitterLink } from '../../src/hooks/twitter';
import { EditIcon } from '@chakra-ui/icons';
import { EditPlayerModal } from '../../src/components/Tournament/Results/ResultsList/Player/EditPlayerModal';
import {
  CombinedPlayerProfile,
  StoredPlayerProfile,
  TwitterPlayerProfile,
} from '../../types/player';
import { usePlayerPerformance } from '../../src/hooks/tournamentResults';
import { ResultsRow } from '../../src/components/Tournament/Results/ResultsList/ResultsRow';
import { ResultsHeader } from '../../src/components/Tournament/Results/ResultsList/ResultsHeader';
import supabase from '../../src/lib/supabase/client';
import { ComplainLink } from '../../src/components/common/ComplainLink';
import { useRouter } from 'next/router';

function PlayerPage({
  user,
  userIsOwnerOfPage,
}: {
  user: CombinedPlayerProfile | null;
  userIsOwnerOfPage: boolean;
}) {
  const userIsAdmin = useUserIsAdmin();
  const twitterLink = useTwitterLink(user?.username);
  const tournamentPerformance = usePlayerPerformance(
    user?.name,
    user?.tournamentHistory
  );

  const session = useSession();
  const { query } = useRouter();

  if (!user) {
    if (session.data?.user.username === query.id) {
      return (
        <Stack padding='1.5rem' spacing={4}>
          <Stack>
            <Heading color='gray.700'>Welcome to Stats!</Heading>
            <Text>{`Unfortunately we don't have an account set up for you yet. We want to make this right.`}</Text>
          </Stack>
          <div>
            <ComplainLink />
          </div>
        </Stack>
      );
    } else {
      return (
        <Stack padding='1.5rem' spacing={4}>
          <Stack>
            <Heading color='gray.700'>{`Couldn't find player`}</Heading>
            <Text>{`Make sure you spelled their name right. If you did, it's probably my fault - oops`}</Text>
          </Stack>
          <div>
            <ComplainLink />
          </div>
        </Stack>
      );
    }
  }

  return (
    <>
      <Stack padding='1.5rem 1.5rem' spacing={6}>
        <Stack>
          <Avatar
            size={'2xl'}
            name={user?.name ?? undefined}
            src={user?.profile_image_url ?? undefined}
          />
          <Stack spacing={0}>
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
        {userIsOwnerOfPage && (
          <Stack>
            {userIsAdmin ? (
              <Heading size={'sm'} fontWeight='semibold'>
                You are a site admin!
              </Heading>
            ) : (
              <>
                <Heading size={'sm'} fontWeight='semibold'>
                  You are not a site admin.
                </Heading>
                <ComplainLink />
              </>
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
        <TableContainer>
          <Table>
            <ResultsHeader view='profile' />
            <Tbody>
              {tournamentPerformance.map(
                ({ performance, tournament }, idx) =>
                  tournament && (
                    <ResultsRow
                      key={idx}
                      result={performance}
                      tournament={tournament}
                      // TODO: Make this able to change current tournament in this view
                      // Though, we'd probably want the API to say what tournaments are ongoing.
                      allowEdits={false}
                      tournamentFinished={true}
                      view='profile'
                    />
                  )
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </>
  );
}

export async function getStaticProps(context: any) {
  const username = context.params?.id.toLowerCase();

  const playerProfiles: Record<string, StoredPlayerProfile> | undefined =
    await fetchPlayerProfiles('twitter_handle');
  const twitterProfile: TwitterPlayerProfile | undefined =
    await fetchTwitterProfile({ username });
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
