import {
  Stack,
  Avatar,
  LinkOverlay,
  LinkBox,
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
import { SHOULD_SHOW_COMING_SOON } from '../../../lib/coming-soon';
import React from 'react';
import { useRouter } from 'next/router';
import { StickyHeader } from '../../common/Layout/StickyHeader';

export const AppBar = () => {
  const session = useSession();
  const { data: userProfile } = useSessionUserProfile();
  const router = useRouter();

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
          (session.status !== 'unauthenticated' ? (
            <>
              <LinkBox>
                <LinkOverlay
                  as={NextLink}
                  href={userProfile ? `/profile` : `/setup-profile`}
                >
                  <Stack direction={'row'} alignItems='end' spacing={-1.5}>
                    {!session.data?.user?.image ? (
                      <SkeletonCircle size='8' />
                    ) : (
                      <Avatar
                        size='sm'
                        name={session.data?.user?.name as string}
                        src={session.data?.user?.image as string}
                      />
                    )}
                    {userProfile ? (
                      <VerifiedIcon />
                    ) : session.status === 'loading' || !userProfile ? (
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
