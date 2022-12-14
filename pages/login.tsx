import { Button } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

export default function Login() {
  return (
    <Button variant={'outline'} leftIcon={<FcGoogle />} onClick={() => signIn('google')}>
      Sign In
    </Button>
  );
}
