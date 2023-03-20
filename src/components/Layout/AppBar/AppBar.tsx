import {
  Stack,
  Avatar,
  LinkOverlay,
  LinkBox,
  SkeletonCircle,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { FaSign, FaSignInAlt, FaTwitter, FaUser } from 'react-icons/fa';
import { useSessionUserProfile } from '../../../hooks/user';
import { NotVerifiedIcon, VerifiedIcon } from '../../Player/Icons';
import { AppDrawerButton, UserStatus } from './AppDrawerButton';
import { AppLogo } from './AppLogo';
import React, { useCallback, useContext } from 'react';
import { useRouter } from 'next/router';
import { StickyHeader } from '../../common/Layout/StickyHeader';
import { DarkModeToggle } from '../../DarkModeToggle/DarkModeToggle';

export const AppBar = () => {
  const session = useSession();
  const { data: userProfile, isLoading: profileIsLoading } =
    useSessionUserProfile();
  const router = useRouter();

  const getUserStatus = useCallback((): UserStatus => {
    if (session.status === 'authenticated') {
      if (userProfile?.id) {
        return 'setup';
      }
      return 'not-setup';
    }

    return 'logged-out';
  }, [session.status, userProfile?.id]);

  return (
    <StickyHeader id='app-bar'>
      <Stack
        direction={'row'}
        alignItems={'center'}
        padding={'0.25rem 1.5rem'}
        justifyContent={'space-between'}
      >
        {<AppDrawerButton userStatus={getUserStatus()} userProfile={userProfile} />}
        {router.asPath !== '/' && router.asPath !== '/help' && <AppLogo />}
        <HStack spacing={4}>
          <DarkModeToggle />
          {session.status !== 'unauthenticated' ? (
            <>
              <LinkBox>
                <LinkOverlay
                  as={NextLink}
                  href={
                    userProfile
                      ? userProfile.username
                        ? `/player/${userProfile.username}`
                        : `/profile`
                      : `/setup-profile`
                  }
                >
                  <Stack direction={'row'} alignItems='end' spacing={-1.5}>
                    {!session.data?.user?.image ? (
                      <SkeletonCircle size='8' />
                    ) : (
                      <Avatar
                        size='sm'
                        name={session.data?.user?.name ?? undefined}
                        src={session.data?.user?.image}
                      />
                    )}
                    {userProfile ? (
                      <VerifiedIcon />
                    ) : profileIsLoading ? (
                      <SkeletonCircle size='4' />
                    ) : (
                      <NotVerifiedIcon />
                    )}
                  </Stack>
                </LinkOverlay>
              </LinkBox>
            </>
          ) : (
            <IconButton
              size={'sm'}
              variant='outline'
              onClick={() => signIn('google')}
              aria-label='log in'
              icon={<FaUser />}
            />
          )}
        </HStack>
      </Stack>
    </StickyHeader>
  );
};
