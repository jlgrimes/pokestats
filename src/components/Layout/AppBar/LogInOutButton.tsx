import { Button } from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';

export const LogInOutButton = () => {
  const { data: session } = useSession();

  return session ? (
    <Button
      variant='outline'
      aria-label={'Log out'}
      rightIcon={<FaSignOutAlt />}
      onClick={() => signOut()}
    >
      Log out
    </Button>
  ) : (
    <Button
      variant='outline'
      aria-label={'Log in'}
      onClick={() => signIn('google')}
      rightIcon={<FaSignInAlt />}
    >
      Log in
    </Button>
  );
};
