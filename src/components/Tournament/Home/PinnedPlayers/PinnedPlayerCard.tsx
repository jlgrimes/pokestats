import { Card, CardBody, useToast } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useCallback } from 'react';
import { Standing, Tournament } from '../../../../../types/tournament';
import { useUserIsAdmin } from '../../../../hooks/administrators';
import {
  deletePinnedPlayer,
  usePinnedPlayers,
} from '../../../../hooks/pinnedPlayers';
import { StandingsRow } from '../../../DataDisplay/Standings/StandingsRow';

interface PinnedPlayerCardProps {
  player: Standing;
  tournament: Tournament;
}

export const PinnedPlayerCard = (props: PinnedPlayerCardProps) => {
  const session = useSession();
  const toast = useToast();
  const { refetch } = usePinnedPlayers(props.tournament.id);
  const { data: userIsAdmin } = useUserIsAdmin();

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
        title: `Error unpinning ${props.player.name}`,
        description: res.error.message,
      });
    }

    await refetch();

    return toast({
      status: 'success',
      title: `Successfully unpinned ${props.player.name}`,
    });
  }, [props.player.name, session.data?.user?.email, toast, refetch]);

  return (
    <Card>
      <CardBody paddingX={0}>
        <StandingsRow
          result={props.player}
          tournament={props.tournament}
          onUnpinPlayer={onUnpinPlayer}
          canEditDecks={userIsAdmin}
        />
      </CardBody>
    </Card>
  );
};
