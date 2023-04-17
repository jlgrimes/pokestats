import { Button } from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { getSession } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

export default function Login() {
  const supabaseClient = useSupabaseClient();

  return (
    <>
      <Button
        variant={'outline'}
        leftIcon={<FcGoogle />}
        onClick={() =>
          supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: window.location.origin,
            },
          })
        }
      >
        Sign In
      </Button>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
