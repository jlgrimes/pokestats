import {
  Icon,
  IconButton,
  Link,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { FaTwitter } from 'react-icons/fa';
import NextLink from 'next/link';
import { memo, useEffect, useMemo, useState } from 'react';
import { EditIcon } from '@chakra-ui/icons';
import { EditPlayerModal } from './EditPlayerModal';
import { isMobileDevice } from '../../../../../lib/userAgent';

export const Player = memo(
  ({
    name,
    profile,
    isEditable,
  }: {
    name: string;
    profile: { id: number; twitterHandle: string };
    isEditable: boolean;
  }) => {
    const {
      isOpen: isEditOpen,
      onOpen: openEdit,
      onClose: closeEdit,
    } = useDisclosure();

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      setIsMobile(isMobileDevice());
    }, []);

    return (
      <Stack direction={'row'} alignItems='center'>
        {profile?.twitterHandle ? (
          <Link
            color='blue.500'
            as={NextLink}
            href={`/player/${profile.twitterHandle}`}
          >
            <Text>{name}</Text>
          </Link>
        ) : (
          <Text>{name}</Text>
        )}
        {isEditable && (
          <IconButton
            aria-label='edit-player'
            variant={'ghost'}
            size='xs'
            onClick={openEdit}
          >
            <EditIcon />
          </IconButton>
        )}
        {isEditOpen && (
          <EditPlayerModal
            isOpen={isEditOpen}
            onClose={closeEdit}
            playerProfile={profile}
            name={name}
          />
        )}
      </Stack>
    );
  }
);

Player.displayName = 'Player';
