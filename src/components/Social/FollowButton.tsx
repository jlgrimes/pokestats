import { Button, useToast } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useCallback } from 'react';
import { StoredPlayerProfile } from '../../../types/player';
import { Standing, Tournament } from '../../../types/tournament';
import {
  addPinnedPlayer,
  deletePinnedPlayer,
  useUserIsFollowingPlayer,
} from '../../hooks/pinnedPlayers';

interface FollowButtonProps {
  playerName: string;
}

export const FollowButton = (props: FollowButtonProps) => {
  const session = useSession();
  const toast = useToast();
  const { data: userIsFollowing, refetch } = useUserIsFollowingPlayer(
    props.playerName
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
        props.playerName
      );

      if (res.error) {
        return toast({
          status: 'error',
          title: `Error unfollowing ${props.playerName}`,
          description: res.error.message,
        });
      }
    } else {
      const res = await addPinnedPlayer(
        '',
        session.data.user.email,
        props.playerName
      );

      if (res.error) {
        return toast({
          status: 'error',
          title: `Error following ${props.playerName}`,
          description: res.error.message,
        });
      }
    }

    await refetch();
  }, [
    session.data?.user?.email,
    refetch,
    toast,
    userIsFollowing,
    props.playerName,
  ]);

  if (session.data?.user?.name === props.playerName) return null;

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
