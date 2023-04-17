import { Button } from '@chakra-ui/react';
import { getSession, signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import supabase from '../src/lib/supabase/client';

export default function Login() {
  return (
    <>
      <Button
        variant={'outline'}
        leftIcon={<FcGoogle />}
        onClick={() =>
          supabase.auth.signInWithOAuth({
            provider: 'google',
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
