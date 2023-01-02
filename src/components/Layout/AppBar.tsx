import {
  Heading,
  Stack,
  Text,
  Avatar,
  LinkOverlay,
  LinkBox,
  Button,
  SkeletonCircle,
} from '@chakra-ui/react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaTwitter } from 'react-icons/fa';
import { useSessionUserProfile } from '../../hooks/user';

export const AppBar = () => {
  const { data: session } = useSession();
  const { data: userProfile, isLoading: isUserProfileLoading } =
    useSessionUserProfile();

  return (
    <>
      <Stack
        direction={'row'}
        alignItems={'center'}
        padding={'0.25rem 1.5rem 0.25rem'}
        justifyContent={'space-between'}
        boxShadow='sm'
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
              <LinkBox>
                <LinkOverlay
                  href={
                    userProfile
                      ? `/player/${session.user.username}`
                      : `/setup-profile`
                  }
                >
                  {isUserProfileLoading ? (
                    <SkeletonCircle size='10' />
                  ) : (
                    <Avatar
                      size='sm'
                      name={session.user?.name as string}
                      src={session.user?.profile_image_url as string}
                    />
                  )}
                </LinkOverlay>
              </LinkBox>
            </>
          ) : (
            <Button
              size={'sm'}
              colorScheme='twitter'
              variant='outline'
              onClick={() => signIn('twitter')}
              rightIcon={<FaTwitter />}
            >
              Log in
            </Button>
          )}
        </Stack>
      </Stack>
    </>
  );
};
