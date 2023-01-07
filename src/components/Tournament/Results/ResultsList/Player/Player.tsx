import {
  IconButton,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { memo } from 'react';
import { EditIcon } from '@chakra-ui/icons';
import { PlayerNameLink } from '../../../../Player/PlayerNameLink';
import { StoredPlayerProfile } from '../../../../../../types/player';

export const Player = memo(
  ({
    name,
    profile,
    isEditable,
  }: {
    name: string;
    profile: StoredPlayerProfile;
    isEditable: boolean;
  }) => {
    const {
      isOpen: isEditOpen,
      onOpen: openEdit,
      onClose: closeEdit,
    } = useDisclosure();

    return (
      <Stack direction={'row'} alignItems='center'>
        <PlayerNameLink name={name} email={profile?.email} />
        {isEditable && (
          <IconButton
            aria-label='edit-player'
            variant={'ghost'}
            size='xs'
            onClick={openEdit}
          >
            {/* <EditIcon /> */}
          </IconButton>
        )}
      </Stack>
    );
  }
);

Player.displayName = 'Player';
