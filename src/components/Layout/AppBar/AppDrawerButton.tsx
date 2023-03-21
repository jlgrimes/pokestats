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
} from '@chakra-ui/react';
import { Session } from 'next-auth';
import NextLink from 'next/link';
import { useRef } from 'react';
import {
  FaBars,
  FaRegCalendar,
  FaRegListAlt,
  FaRegQuestionCircle,
  FaRegUser,
} from 'react-icons/fa';
import { CombinedPlayerProfile } from '../../../../types/player';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { AccountRequestLink } from '../AccountRequestsLink';
import { LogInOutButton } from './LogInOutButton';
import { IconCards } from '@tabler/icons-react';

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
              rowGap={'1.5rem'}
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
                <Icon as={FaRegQuestionCircle} />
              </HStack>

              <Link as={NextLink} href={'/help'} onClick={onClose}>
                <Heading size='lg'>Help</Heading>
              </Link>
            </Grid>
            <Stack spacing={4} padding='4.5rem 3.5rem'>
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
              <LogInOutButton />
            </Stack>
          </Stack>
        </DrawerContent>
      </Drawer>
    </>
  );
};
