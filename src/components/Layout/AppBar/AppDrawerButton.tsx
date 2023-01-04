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
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRef } from 'react';
import { FaBars } from 'react-icons/fa';
import { CombinedPlayerProfile } from '../../../../types/player';

export const AppDrawerButton = ({
  userProfile,
}: {
  userProfile: CombinedPlayerProfile | null | undefined;
}) => {
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
          <Stack padding='1.5rem 1.5rem'>
            <Link as={NextLink} href='/' onClick={onClose}>
              Home
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
              {userProfile ? 'My Profile' : 'Setup Profile'}
            </Link>
          </Stack>
        </DrawerContent>
      </Drawer>
    </>
  );
};
