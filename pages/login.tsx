import { Button } from '@chakra-ui/react';
import { getSession, signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

export default function Login() {
  return (
    <Button variant={'outline'} leftIcon={<FcGoogle />} onClick={() => signIn('google')}>
      Sign In
    </Button>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context)

  if (session) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    }
  }

  return {
    props: { session }
  }
}