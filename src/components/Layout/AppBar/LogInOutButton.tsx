import { Button, Stack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import supabase from '../../../lib/supabase/client';

export const LogInOutButton = () => {
  const { data: session } = useSession();

  return (
    <Stack>
      {!session && (
        <Button
          colorScheme={'blue'}
          aria-label={'Log in'}
          onClick={() =>
            supabase.auth.signInWithOAuth({
              provider: 'google',
            })
          }
        >
          Sign up
        </Button>
      )}
      {session ? (
        <Button
          variant='outline'
          aria-label={'Log out'}
          onClick={() => supabase.auth.signOut()}
        >
          Log out
        </Button>
      ) : (
        <Button
          variant='outline'
          aria-label={'Log in'}
          onClick={() =>
            supabase.auth.signInWithOAuth({
              provider: 'google',
            })
          }
        >
          Log in
        </Button>
      )}
    </Stack>
  );
};
