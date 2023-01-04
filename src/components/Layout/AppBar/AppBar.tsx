import {
  Stack,
  Avatar,
  LinkOverlay,
  LinkBox,
  Button,
  SkeletonCircle,
} from '@chakra-ui/react';
import { signIn, useSession } from 'next-auth/react';
import { FaTwitter } from 'react-icons/fa';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { useSessionUserProfile } from '../../../hooks/user';
import { NotVerifiedIcon, VerifiedIcon } from '../../Player/Icons';
import { AppDrawerButton } from './AppDrawerButton';
import { AppLogo } from './AppLogo';

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
        <AppDrawerButton userProfile={userProfile} />
        <AppLogo />
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
                <Stack direction={'row'} alignItems='baseline' spacing={-1.5}>
                  {isUserProfileLoading ? (
                    <SkeletonCircle size='8' />
                  ) : (
                    <Avatar
                      size='sm'
                      name={session.user?.name as string}
                      src={session.user?.profile_image_url as string}
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
    </>
  );
};
