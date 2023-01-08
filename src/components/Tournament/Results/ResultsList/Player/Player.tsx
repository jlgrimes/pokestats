import {
  Icon,
  IconButton,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { memo } from 'react';
import { EditIcon } from '@chakra-ui/icons';
import { PlayerNameLink } from '../../../../Player/PlayerNameLink';
import { StoredPlayerProfile } from '../../../../../../types/player';
import { FaChevronDown } from 'react-icons/fa';

export const Player = memo(
  ({
    name,
    profile,
    isExpandable,
  }: {
    name: string;
    profile: StoredPlayerProfile;
    isExpandable: boolean;
  }) => {
    return (
      <Stack direction={'row'} alignItems='center'>
        <PlayerNameLink name={name} email={profile?.email} />
        {isExpandable && (
          <Icon
            color='gray.500'
            as={FaChevronDown}
            aria-label='edit-player'
            boxSize={3}
            onClick={openEdit}
          />
        )}
      </Stack>
    );
  }
);

Player.displayName = 'Player';
