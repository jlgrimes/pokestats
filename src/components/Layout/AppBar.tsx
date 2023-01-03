import {
  Heading,
  Stack,
  Text,
  Avatar,
  LinkOverlay,
  LinkBox,
  Button,
  SkeletonCircle,
  Icon,
  IconButton,
} from '@chakra-ui/react';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  FaCheckCircle,
  FaIdBadge,
  FaTimesCircle,
  FaTwitter,
} from 'react-icons/fa';
import { useUserIsAdmin } from '../../hooks/administrators';
import { useSessionUserProfile } from '../../hooks/user';
import { NotVerifiedIcon, VerifiedIcon } from '../Player/Icons';
import { AdminLinks } from './AdminLinks';

export const AppBar = () => {
  const { data: session } = useSession();
  const { data: userProfile, isLoading: isUserProfileLoading } =
    useSessionUserProfile();
  const { data: userIsAdmin } = useUserIsAdmin();

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
          {userIsAdmin && <AdminLinks />}
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
                  <Stack direction={'row'} alignItems='baseline' spacing={0}>
                    {isUserProfileLoading ? (
                      <SkeletonCircle size='10' />
                    ) : (
                      <Avatar
                        size='sm'
                        name={session.user?.name as string}
                        src={session.user?.profile_image_url as string}
                      />
                    )}
                    {userProfile ? <VerifiedIcon /> : <NotVerifiedIcon />}
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
      </Stack>
    </>
  );
};
