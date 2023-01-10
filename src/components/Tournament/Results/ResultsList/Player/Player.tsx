import { Stack } from '@chakra-ui/react';
import { memo } from 'react';
import { PlayerNameLink } from '../../../../Player/PlayerNameLink';
import { StoredPlayerProfile } from '../../../../../../types/player';

export const Player = memo(
  ({
    name,
    profile,
    toggleRowExpanded,
  }: {
    name: string;
    profile: StoredPlayerProfile;
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
      </Stack>
    );
  }
);

Player.displayName = 'Player';
