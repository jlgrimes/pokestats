import { Button, Stack } from '@chakra-ui/react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

export const LogInOutButton = () => {
  const user = useUser();
  const supabaseClient = useSupabaseClient();

  return (
    <Stack>
      {!user?.email && (
        <Button
          colorScheme={'blue'}
          aria-label={'Log in'}
          onClick={() =>
            supabaseClient.auth.signInWithOAuth({
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
          onClick={() => supabaseClient.auth.signOut()}
        >
          Log out
        </Button>
      ) : (
        <Button
          variant='outline'
          aria-label={'Log in'}
          onClick={() =>
            supabaseClient.auth.signInWithOAuth({
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
