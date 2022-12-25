import { Avatar, Heading, Stack, Text, Link, Button } from '@chakra-ui/react';
import { getSession, signOut } from 'next-auth/react';
import { FaSignOutAlt } from 'react-icons/fa';
import { useUserIsAdmin } from '../../src/hooks/administrators';
import { fetchPlayerProfiles } from '../../src/lib/fetch/fetchLiveResults';
import { fetchTwitterProfile } from '../api/get-twitter-profile';

function PlayerPage({
  user,
  userIsOwnerOfPage,
}: {
  user: Record<string, any>;
  userIsOwnerOfPage: boolean;
}) {
  const userIsAdmin = useUserIsAdmin();

  return (
    <Stack padding='1.5rem 1.5rem'>
      <Stack>
        <Avatar
          name={user?.name ?? undefined}
          src={user?.profile_image_url ?? undefined}
        />
        <Heading color='gray.700'>{user?.name}</Heading>
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

  return {
    props: {
      user: {
        ...(twitterProfile?.data ?? {}),
      },
      userIsOwnerOfPage,
    },
  };
}

export default PlayerPage;
