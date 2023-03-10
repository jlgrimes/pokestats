import { Button, Stack } from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

export const LogInOutButton = () => {
  const { data: session } = useSession();

  return (
    <Stack>
      {!session && (
        <Button
          colorScheme={'blue'}
          aria-label={'Log in'}
          onClick={() => signIn('google')}
        >
          Sign up
        </Button>
      )}
      {session ? (
        <Button
          variant='outline'
          aria-label={'Log out'}
          onClick={() => signOut()}
        >
          Log out
        </Button>
      ) : (
        <Button
          variant='outline'
          aria-label={'Log in'}
          onClick={() => signIn('google')}
        >
          Log in
        </Button>
      )}
    </Stack>
  );
};
