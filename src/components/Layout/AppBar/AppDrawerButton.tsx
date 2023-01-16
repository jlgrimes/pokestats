import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Stack,
  Text,
  Link,
  Heading,
  Divider,
  Grid,
  Icon,
} from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
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
import { parseUsername } from '../../../lib/strings';
import { AccountRequestLink } from '../AccountRequestsLink';
import { LogInOutButton } from './LogInOutButton';

export const AppDrawerButton = ({
  userProfile,
}: {
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
              templateColumns='1fr 1fr'
              rowGap={'1.5rem'}
              padding='4.5rem 4.25rem 4.5rem 3.25rem'
              alignItems={'center'}
            >
              <Icon as={FaRegCalendar} />
              <Link as={NextLink} href='/tournaments' onClick={onClose}>
                <Heading size='lg'>Tournaments</Heading>
              </Link>

              <Icon as={FaRegListAlt} />
              <Link as={NextLink} href='/decks' onClick={onClose}>
                <Heading size='lg'>Decks</Heading>
              </Link>

              <Icon as={FaRegUser} />
              <Link
                as={NextLink}
                href={
                  userProfile
                    ? `/player/${parseUsername(userProfile.email)}`
                    : `/setup-profile`
                }
                onClick={onClose}
              >
                <Heading size='lg'>
                  {userProfile ? 'My profile' : 'Setup profile'}
                </Heading>
              </Link>

              <Icon as={FaRegQuestionCircle} />
              <Link as={NextLink} href={'/about'} onClick={onClose}>
                <Heading size='lg'>About</Heading>
              </Link>
            </Grid>
            <Stack spacing={4} padding='4.5rem 3.5rem'>
              {userIsAdmin && (
                <Stack>
                  <Heading size='lg'>Admin tools</Heading>
                  <AccountRequestLink onClose={onClose} />
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
