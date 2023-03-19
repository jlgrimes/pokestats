import { Button, useToast } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useCallback } from 'react';
import { Standing, Tournament } from '../../../types/tournament';
import {
  addPinnedPlayer,
  deletePinnedPlayer,
  useUserIsFollowingPlayer,
} from '../../hooks/pinnedPlayers';

interface FollowButtonProps {
  player: Standing;
  tournament: Tournament;
}

export const FollowButton = (props: FollowButtonProps) => {
  const session = useSession();
  const toast = useToast();
  const { data: userIsFollowing, refetch } = useUserIsFollowingPlayer(
    props.player.name
  );

  const handleClick = useCallback(async () => {
    if (!session.data?.user?.email) {
      return toast({
        status: 'error',
        title: 'Session invalid',
      });
    }

    if (userIsFollowing) {
      const res = await deletePinnedPlayer(
        session.data.user.email,
        props.player.name
      );

      if (res.error) {
        return toast({
          status: 'error',
          title: `Error unfollowing ${props.player.name}`,
          description: res.error.message,
        });
      }
    } else {
      const res = await addPinnedPlayer(
        props.tournament.id,
        session.data.user.email,
        props.player.name
      );

      if (res.error) {
        return toast({
          status: 'error',
          title: `Error following ${props.player.name}`,
          description: res.error.message,
        });
      }
    }

    await refetch();
  }, [
    session.data?.user?.email,
    refetch,
    toast,
    props.tournament.id,
    userIsFollowing,
    props.player.name,
  ]);

  if (session.data?.user?.name === props.player.name) return null;

  return (
    <Button
      size='xs'
      borderRadius={32}
      colorScheme='blue'
      variant={userIsFollowing ? 'solid' : 'outline'}
      onClick={handleClick}
    >
      {userIsFollowing ? 'Following' : 'Follow'}
    </Button>
  );
};
