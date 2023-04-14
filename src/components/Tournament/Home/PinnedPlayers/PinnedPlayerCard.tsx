import {
  Box,
  Card,
  CardBody,
  Heading,
  HStack,
  IconButton,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { Fragment, useCallback } from 'react';
import { FaHeartBroken } from 'react-icons/fa';
import { Standing, Tournament } from '../../../../../types/tournament';
import { useUserIsAdmin } from '../../../../hooks/administrators';
import {
  deletePinnedPlayer,
  usePinnedPlayers,
} from '../../../../hooks/pinnedPlayers';
import { usePlayerIsMeOrMyOpponent } from '../../../../hooks/tournamentResults';
import { StandingsRow } from '../../../DataDisplay/Standings/StandingsRow';
import {
  PlayerCard,
  PlayerCardProps,
  PlayerCardSize,
} from '../PlayerCard/PlayerCard';

interface PinnedPlayerCardProps {
  player: Standing;
  tournament: Tournament;
  shouldHideDecks: boolean | undefined;
  isEditingPinned: boolean;
  isDeckLoading?: boolean;
  shouldHideOpponent?: boolean;
  size?: PlayerCardSize;
}

export const PinnedPlayerCard = (props: PinnedPlayerCardProps) => {
  const session = useSession();
  const toast = useToast();
  const { refetch } = usePinnedPlayers();
  const { data: userIsAdmin } = useUserIsAdmin();
  const isMeOrMyOpponent = usePlayerIsMeOrMyOpponent(props.player);

  const onUnpinPlayer = useCallback(async () => {
    if (!session.data?.user?.email) {
      return toast({
        status: 'error',
        title: 'Session invalid',
      });
    }

    const res = await deletePinnedPlayer(
      session.data.user.email,
      props.player.name
    );

    if (res.error) {
      return toast({
        status: 'error',
        title: `Error unfavoriting ${props.player.name}`,
        description: res.error.message,
      });
    }

    await refetch();
  }, [props.player.name, session.data?.user?.email, toast, refetch]);

  return (
    <HStack>
      <PlayerCard
        canEditDecks={userIsAdmin}
        onUnpinPlayer={onUnpinPlayer}
        shouldHideOpponent={props.shouldHideOpponent}
        result={
          props.tournament.tournamentStatus === 'running'
            ? props.player.currentMatchResult
            : undefined
        }
        isPlayerMeOrMyOpponent={isMeOrMyOpponent}
        player={props.player}
        tournament={props.tournament}
        size={props.size}
        shouldHideDecks={props.shouldHideDecks}
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
    </HStack>
  );
};
