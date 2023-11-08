import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
  IconButton,
  Stack,
  Link,
  Heading,
  Grid,
  Icon,
  HStack,
  Box,
} from '@chakra-ui/react';
import { Session } from 'next-auth';
import NextLink from 'next/link';
import { useRef } from 'react';
import {
  FaBars,
  FaInfo,
  FaRegCalendar,
  FaRegCompass,
  FaRegListAlt,
  FaRegQuestionCircle,
  FaRegUser,
} from 'react-icons/fa';
import { CombinedPlayerProfile } from '../../../../types/player';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { AccountRequestLink } from '../AccountRequestsLink';
import { LogInOutButton } from './LogInOutButton';
import { IconCards } from '@tabler/icons-react';
import { DarkModeToggle } from '../../DarkModeToggle/DarkModeToggle';

export type UserStatus = 'logged-out' | 'not-setup' | 'setup';

export const AppDrawerButton = ({
  userStatus,
  userProfile,
}: {
  userStatus: UserStatus;
  userProfile: CombinedPlayerProfile | null | undefined;
}) => {
  const { data: userIsAdmin } = useUserIsAdmin();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  return (
    <>
      <IconButton
        ref={btnRef.current}
        icon={<FaBars />}
        aria-label='Open drawer'
        onClick={onOpen}
        variant='ghost'
      />
      <Drawer
        isOpen={isOpen}
        placement='left'
        size='xs'
        onClose={onClose}
        finalFocusRef={btnRef.current}
      >
        <DrawerOverlay />
        <DrawerContent>
          <Stack justifyContent='space-between' height='100%'>
            <Grid
              paddingTop={'4.5rem'}
              templateColumns='0.6fr 1fr'
              rowGap={'1rem'}
              alignItems={'center'}
            >
              <HStack justifyContent={'end'} paddingRight={10}>
                <Icon as={FaRegCalendar} />
              </HStack>
              <Link as={NextLink} href='/tournaments' onClick={onClose}>
                <Heading size='lg'>Tournaments</Heading>
              </Link>

              <HStack justifyContent={'end'} paddingRight={10}>
                <Icon as={IconCards} />
              </HStack>

              <Link as={NextLink} href='/decks' onClick={onClose}>
                <Heading size='lg'>Decks</Heading>
              </Link>

              <HStack justifyContent={'end'} paddingRight={10}>
                <Icon as={FaRegCompass} />
              </HStack>
              <Link as={NextLink} href='/events' onClick={onClose}>
                <Heading size='lg'>Events</Heading>
              </Link>

              {userStatus !== 'logged-out' && (
                <>
                  <HStack justifyContent={'end'} paddingRight={10}>
                    <Icon as={FaRegUser} />
                  </HStack>
                  <Link
                    as={NextLink}
                    href={
                      userStatus === 'setup'
                        ? userProfile?.username
                          ? `/player/${userProfile.username}`
                          : `/profile`
                        : '/setup-profile'
                    }
                    onClick={onClose}
                  >
                    <Heading size='lg'>
                      {userStatus === 'setup' ? 'My profile' : 'Setup profile'}
                    </Heading>
                  </Link>
                </>
              )}

              <HStack justifyContent={'end'} paddingRight={10}>
                <Icon as={FaInfo} />
              </HStack>

              <Link as={NextLink} href={'/about'} onClick={onClose}>
                <Heading size='lg'>About</Heading>
              </Link>
            </Grid>
            <Stack padding='1.5rem 3.5rem' spacing={6}>
              <Link as={NextLink} href={'/contact-us'} onClick={onClose}>
                <Heading size='md'>Contact Us</Heading>
              </Link>

              <Link as={NextLink} href={'/privacy-policy'} onClick={onClose}>
                <Heading size='md'>Privacy Policy</Heading>
              </Link>
            </Stack>
            <Stack spacing={4} padding='3rem 3.5rem'>
              {userIsAdmin && (
                <Stack>
                  <Heading size='lg'>Admin tools</Heading>
                  <AccountRequestLink onClose={onClose} />
                  <Link
                    as={NextLink}
                    href='/admin/report-activity'
                    onClick={onClose}
                  >
                    <Heading size='sm'>Reporting activity</Heading>
                  </Link>
                </Stack>
              )}
              <Stack spacing={0}>
                <Box ml='-3'>
                  <DarkModeToggle />
                </Box>
                <LogInOutButton />
              </Stack>
            </Stack>
          </Stack>
        </DrawerContent>
      </Drawer>
    </>
  );
};
