import { HStack, IconButton, useToast } from '@chakra-ui/react';
import { useUser } from '@supabase/auth-helpers-react';
import { Flex } from '@tremor/react';
import { useCallback } from 'react';
import { FaHeartBroken } from 'react-icons/fa';
import { Standing, Tournament } from '../../../../../types/tournament';
import { useUserIsAdmin } from '../../../../hooks/administrators';
import {
  deletePinnedPlayer,
  usePinnedPlayers,
} from '../../../../hooks/pinnedPlayers';
import { PlayerCard, PlayerCardSize } from '../PlayerCard/PlayerCard';

interface PinnedPlayerCardProps {
  player: Standing;
  tournament: Tournament;
  isEditingPinned: boolean;
  isDeckLoading?: boolean;
  shouldHideOpponent?: boolean;
  size?: PlayerCardSize;
}

export const PinnedPlayerCard = (props: PinnedPlayerCardProps) => {
  const user = useUser();
  const toast = useToast();
  const { refetch } = usePinnedPlayers();
  const { data: userIsAdmin } = useUserIsAdmin();
  const isMeOrMyOpponent = false;

  const onUnpinPlayer = useCallback(async () => {
    if (!user?.email) {
      return toast({
        status: 'error',
        title: 'Session invalid',
      });
    }

    const res = await deletePinnedPlayer(user.email, props.player.name);

    if (res.error) {
      return toast({
        status: 'error',
        title: `Error unfavoriting ${props.player.name}`,
        description: res.error.message,
      });
    }

    await refetch();
  }, [props.player.name, user?.email, toast, refetch]);

  return (
    <>
      <PlayerCard
        canEditDecks={userIsAdmin}
        onUnpinPlayer={onUnpinPlayer}
        shouldHideOpponent={props.shouldHideOpponent}
        result={
          props.tournament.tournamentStatus === 'running'
            ? props.player.currentMatchResult
            : undefined
        }
        player={props.player}
        tournament={props.tournament}
        size={props.size}
      />
      {props.isEditingPinned && (
        <IconButton
          size={'sm'}
          variant='unstyled'
          aria-label='unfavorite player'
          icon={<FaHeartBroken />}
          color='pink.700'
          onClick={e => {
            e.stopPropagation();
            onUnpinPlayer();
          }}
        />
      )}
    </>
  );
};
