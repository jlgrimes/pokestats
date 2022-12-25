import {
  Heading,
  IconButton,
  Stack,
  Text,
  Highlight,
  Divider,
  Avatar,
  LinkOverlay,
  LinkBox,
} from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useTwitterUsername } from '../../hooks/twitter';

export const AppBar = () => {
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

              <LinkBox>
                <LinkOverlay href='/profile'>
                  <Avatar
                    size='sm'
                    name={session.user?.name as string}
                    src={session.user?.image as string}
                  />
                </LinkOverlay>
              </LinkBox>
            </>
          ) : (
            <>
              <Text>Log in</Text>
              <IconButton
                variant='outline'
                size={'sm'}
                aria-label={'Log in'}
                icon={<FaSignInAlt />}
                onClick={() => signIn('twitter')}
              />
            </>
          )}
        </Stack>
      </Stack>
      <Divider />
    </>
  );
};
