import { Icon, IconButton, Stack, useDisclosure } from '@chakra-ui/react';
import { memo } from 'react';
import { EditIcon } from '@chakra-ui/icons';
import { PlayerNameLink } from '../../../../Player/PlayerNameLink';
import { StoredPlayerProfile } from '../../../../../../types/player';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export const Player = memo(
  ({
    name,
    profile,
    rowExpanded,
    toggleRowExpanded,
  }: {
    name: string;
    profile: StoredPlayerProfile;
    rowExpanded?: boolean;
    toggleRowExpanded?: () => void;
  }) => {
    return (
      <Stack
        direction={'row'}
        alignItems='center'
        onClick={toggleRowExpanded}
        cursor={toggleRowExpanded ? 'pointer' : 'auto'}
      >
        <PlayerNameLink name={name} email={profile?.email} />
        {toggleRowExpanded && (
          <Icon
            color='gray.500'
            as={!!rowExpanded ? FaChevronUp : FaChevronDown}
            aria-label='edit-player'
            boxSize={2}
          />
        )}
      </Stack>
    );
  }
);

Player.displayName = 'Player';
