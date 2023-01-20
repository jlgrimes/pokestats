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
                <Icon as={FaRegListAlt} />
              </HStack>

              <Link as={NextLink} href='/decks' onClick={onClose}>
                <Heading size='lg'>Decks</Heading>
              </Link>

              <HStack justifyContent={'end'} paddingRight={10}>
                <Icon as={FaRegUser} />
              </HStack>

              <Link as={NextLink} href={'/profile'} onClick={onClose}>
                <Heading size='lg'>
                  {userProfile ? 'My profile' : 'Setup profile'}
                </Heading>
              </Link>

              <HStack justifyContent={'end'} paddingRight={10}>
                <Icon as={FaRegQuestionCircle} />
              </HStack>

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
