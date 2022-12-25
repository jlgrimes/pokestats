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
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { getSession, signOut } from 'next-auth/react';
import { useMemo } from 'react';
import { FaSignOutAlt, FaTwitter } from 'react-icons/fa';
import { useUserIsAdmin } from '../../src/hooks/administrators';
import { fetchPlayerProfiles } from '../../src/lib/fetch/fetchLiveResults';
import { isMobileDevice } from '../../src/lib/userAgent';
import { fetchTwitterProfile } from '../api/get-twitter-profile';
import { useTwitterLink } from '../../src/hooks/twitter';
import { EditIcon } from '@chakra-ui/icons';
import { EditPlayerModal } from '../../src/components/Tournament/Results/ResultsList/Player/EditPlayerModal';

function PlayerPage({
  user,
  userIsOwnerOfPage,
}: {
  user?: Record<string, any>;
  userIsOwnerOfPage: boolean;
}) {
  const userIsAdmin = useUserIsAdmin();
  const twitterLink = useTwitterLink(user?.username);

  if (!user) {
    return (
      <div>We could not find that player. Typo?</div>
    )
  }

  return (
    <Stack padding='1.5rem 1.5rem'>
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
              <Text>
                If you believe this to be wrong,{' '}
                <Link href={'twitter.com/jgrimesey'} isExternal color={'blue'}>
                  complain to me on Twitter.
                </Link>
              </Text>
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
    </Stack>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);
  const username = context.params?.id;
  let userIsOwnerOfPage = false;

  const playerProfiles: Record<string, any> =
    (await fetchPlayerProfiles('twitter_handle')) ?? {};
  const twitterProfile = await fetchTwitterProfile({ username });

  const user = playerProfiles[username] ? {
    ...(twitterProfile ?? {})
  }: null

  return {
    props: {
      user,
      userIsOwnerOfPage,
    },
  };
}

export default PlayerPage;
