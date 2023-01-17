import {
  Stack,
  Avatar,
  LinkOverlay,
  LinkBox,
  Button,
  SkeletonCircle,
  IconButton,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { FaSign, FaSignInAlt, FaTwitter } from 'react-icons/fa';
import { useSessionUserProfile } from '../../../hooks/user';
import { NotVerifiedIcon, VerifiedIcon } from '../../Player/Icons';
import { AppDrawerButton } from './AppDrawerButton';
import { AppLogo } from './AppLogo';
import { parseUsername } from '../../../lib/strings';
import { SHOULD_SHOW_COMING_SOON } from '../../../lib/coming-soon';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { StickyHeader } from '../../common/Layout/StickyHeader';

export const AppBar = () => {
  const { data: session } = useSession();
  const { data: userProfile, isLoading: isUserProfileLoading } =
    useSessionUserProfile();
  const [scrollTop, setScrollTop] = useState(0);
  const router = useRouter();



  const disableSticky =
    router.asPath.includes('finishes') || router.asPath.includes('cards');

  return (
    <StickyHeader id='app-bar'>
      <Stack
        direction={'row'}
        alignItems={'center'}
        padding={'0.25rem 1.5rem'}
        justifyContent={SHOULD_SHOW_COMING_SOON ? 'center' : 'space-between'}
      >
        {!SHOULD_SHOW_COMING_SOON && (
          <AppDrawerButton userProfile={userProfile} />
        )}
        {router.asPath !== '/' && <AppLogo />}
        {!SHOULD_SHOW_COMING_SOON &&
          (session ? (
            <>
              <LinkBox>
                <LinkOverlay
                  as={NextLink}
                  href={
                    userProfile
                      ? `/player/${parseUsername(session.user.email)}`
                      : `/setup-profile`
                  }
                >
                  <Stack direction={'row'} alignItems='baseline' spacing={-1.5}>
                    {isUserProfileLoading ? (
                      <SkeletonCircle size='8' />
                    ) : (
                      <Avatar
                        size='sm'
                        name={session.user?.name as string}
                        src={session.user?.image as string}
                      />
                    )}
                    {userProfile ? (
                      <VerifiedIcon />
                    ) : isUserProfileLoading ? (
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
              size={'xs'}
              variant='outline'
              onClick={() => signIn('google')}
              aria-label='log in'
              icon={<FaSignInAlt />}
            />
          ))}
      </Stack>
    </StickyHeader>
  );
};
