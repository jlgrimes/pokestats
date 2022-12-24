import {
  Heading,
  IconButton,
  Stack,
  Text,
  Highlight,
  Divider,
} from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useUserIsAdmin } from '../../hooks/administrators';

export const AppBar = () => {
  const userIsAdmin = useUserIsAdmin();
  const { data: session } = useSession();

  return (
    <>
      <Stack
        direction={'row'}
        alignItems={'center'}
        padding={'0.25rem 1.5rem 0.25rem'}
        justifyContent={'space-between'}
      >
        <Heading
          color={'gray.700'}
          letterSpacing={'wider'}
          textTransform={'uppercase'}
          size={'md'}
          fontWeight={'black'}
          lineHeight={'taller'}
        >
          <Link href='/'>pokéstats</Link>
        </Heading>
        <Stack direction={'row'} alignItems={'center'}>
          {session ? (
            <>
              <Text>
                Hi,{' '}
                {session.user?.name?.substring(
                  0,
                  session.user?.name?.indexOf(' ')
                )}
                !
              </Text>
              <IconButton
                variant='outline'
                size={'sm'}
                aria-label={'Log out'}
                icon={<FaSignOutAlt />}
                onClick={() => signOut()}
              />
            </>
          ) : (
            <IconButton
              variant='outline'
              size={'sm'}
              aria-label={'Log in'}
              icon={<FaSignInAlt />}
              onClick={() => signIn('google')}
            />
          )}
        </Stack>
      </Stack>
      <Divider />
    </>
  );
};
