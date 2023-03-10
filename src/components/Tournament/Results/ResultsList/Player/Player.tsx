import { Stack } from '@chakra-ui/react';
import { memo } from 'react';
import { PlayerNameLink } from '../../../../Player/PlayerNameLink';
import { StoredPlayerProfile } from '../../../../../../types/player';

export const Player = memo(
  ({ name, profile }: { name: string; profile?: StoredPlayerProfile }) => {
    return (
      <Stack direction={'row'} alignItems='center'>
        <PlayerNameLink name={name} email={profile?.email} />
      </Stack>
    );
  }
);

Player.displayName = 'Player';
