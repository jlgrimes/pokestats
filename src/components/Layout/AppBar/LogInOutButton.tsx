import { Button, Stack } from '@chakra-ui/react';
import { useUser } from '@supabase/auth-helpers-react';
import supabase from '../../../lib/supabase/client';

export const LogInOutButton = () => {
  const user = useUser();

  return (
    <Stack>
      {!user?.email && (
        <Button
          colorScheme={'blue'}
          aria-label={'Log in'}
          onClick={() =>
            supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: window.location.origin,
              },
            })
          }
        >
          Sign up
        </Button>
      )}
      {user?.email ? (
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
              options: {
                redirectTo: window.location.origin,
              },
            })
          }
        >
          Log in
        </Button>
      )}
    </Stack>
  );
};
