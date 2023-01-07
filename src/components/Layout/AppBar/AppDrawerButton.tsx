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
  FaRegListAlt,
  FaRegStickyNote,
  FaRegUser,
  FaSignOutAlt,
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
              templateColumns='repeat(2, 1fr)'
              rowGap={'1.5rem'}
              padding='4.5rem 3.5rem'
              alignItems={'center'}
            >
              <Icon as={FaRegListAlt} />
              <Link as={NextLink} href='/' onClick={onClose}>
                <Heading size='lg'>Tournaments</Heading>
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

              <Icon as={FaRegStickyNote} />
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
