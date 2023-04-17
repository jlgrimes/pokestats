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
import { FaUser } from 'react-icons/fa';
import { useSessionPlayerProfile } from '../../../hooks/user';
import { NotVerifiedIcon, VerifiedIcon } from '../../Player/Icons';
import { AppDrawerButton, UserStatus } from './AppDrawerButton';
import { AppLogo } from './AppLogo';
import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { StickyHeader } from '../../common/Layout/StickyHeader';
import { SearchBar } from './Search/SearchBar';
import supabase from '../../../lib/supabase/client';

export const AppBar = () => {
  const {
    data: userProfile,
    isLoading: profileIsLoading,
    isAuthenticated,
  } = useSessionPlayerProfile();
  const router = useRouter();

  const getUserStatus = useCallback((): UserStatus => {
    if (!isAuthenticated) {
      if (userProfile?.id) {
        return 'setup';
      }
      return 'not-setup';
    }

    return 'logged-out';
  }, [isAuthenticated, userProfile?.id]);

  return (
    <StickyHeader id='app-bar'>
      <Stack
        direction={'row'}
        alignItems={'center'}
        padding={'0.25rem 1.5rem'}
        justifyContent={'space-between'}
      >
        {
          <AppDrawerButton
            userStatus={getUserStatus()}
            userProfile={userProfile}
          />
        }
        <HStack width='full' justifyContent='center'>
          {router.asPath !== '/' && router.asPath !== '/help' && <AppLogo />}
          <SearchBar
            shouldCollapsePlaceholder={
              router.asPath !== '/' && router.asPath !== '/help'
            }
          />
        </HStack>
        <HStack spacing={4}>
          {isAuthenticated ? (
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
                    {!userProfile?.image ? (
                      <SkeletonCircle size='8' />
                    ) : (
                      <Avatar
                        size='sm'
                        name={userProfile?.name ?? undefined}
                        src={userProfile?.image}
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
              onClick={() =>
                supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: window.location.origin,
                  },
                })
              }
              aria-label='log in'
              icon={<FaUser />}
            />
          )}
        </HStack>
      </Stack>
    </StickyHeader>
  );
};
