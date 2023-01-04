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
} from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import NextLink from 'next/link';
import { useRef } from 'react';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import { CombinedPlayerProfile } from '../../../../types/player';
import { useUserIsAdmin } from '../../../hooks/administrators';
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
          <DrawerCloseButton />
          <Stack padding='2rem' justifyContent='space-between' height='100%'>
            <Stack>
              <Link as={NextLink} href='/' onClick={onClose}>
                <Heading size='lg'>Tournaments</Heading>
              </Link>
              <Link
                as={NextLink}
                href={
                  userProfile
                    ? `/player/${userProfile.username}`
                    : `/setup-profile`
                }
                onClick={onClose}
              >
                <Heading size='lg'>
                  {userProfile ? 'My profile' : 'Setup profile'}
                </Heading>
              </Link>
              <Link as={NextLink} href={'/about'} onClick={onClose}>
                <Heading size='lg'>About</Heading>
              </Link>
            </Stack>
            <Stack spacing={4}>
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
