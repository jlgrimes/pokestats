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
import { memo } from 'react';
import { EditIcon } from '@chakra-ui/icons';
import { EditPlayerModal } from './EditPlayerModal';

export const Player = memo(
  ({
    name,
    profile,
    isEditable,
  }: {
    name: string;
    profile: { id: number; twitterUrl: string };
    isEditable: boolean;
  }) => {
    const {
      isOpen: isEditOpen,
      onOpen: openEdit,
      onClose: closeEdit,
    } = useDisclosure();

    return (
      <Stack direction={'row'} alignItems='center'>
        <Text>{name}</Text>
        {profile?.twitterUrl && (
          <Link
            color='twitter.500'
            as={NextLink}
            href={profile.twitterUrl}
            isExternal
          >
            <Icon as={FaTwitter} />
          </Link>
        )}
        {isEditable && (
          <IconButton aria-label='edit-player' variant={'ghost'} size='xs' onClick={openEdit}>
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
