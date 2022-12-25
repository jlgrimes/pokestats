import { Avatar, Heading, Stack, Text, Link, Button } from '@chakra-ui/react';
import { getSession, signOut } from 'next-auth/react';
import { FaSignOutAlt } from 'react-icons/fa';
import { useUserIsAdmin } from '../src/hooks/administrators';

function Profile({ user }: { user: Record<string, any> }) {
  const userIsAdmin = useUserIsAdmin();

  return (
    <Stack padding='1.5rem 1.5rem'>
      <Stack>
        <Avatar name={user?.name ?? undefined} src={user?.image ?? undefined} />
        <Heading color='gray.700'>{user?.name}</Heading>
      </Stack>
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
      </Stack>
      <div>
        <Button
          variant='outline'
          aria-label={'Log out'}
          rightIcon={<FaSignOutAlt />}
          onClick={() => signOut()}
        >
          Log out
        </Button>
      </div>
    </Stack>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: session.user,
    },
  };
}

export default Profile;
