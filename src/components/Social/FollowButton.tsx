import { Button, useToast } from '@chakra-ui/react';
import { signIn } from 'next-auth/react';
import { useCallback } from 'react';
import {
  addPinnedPlayer,
  deletePinnedPlayer,
  useUserIsFollowingPlayer,
} from '../../hooks/pinnedPlayers';
import { useSessionPlayerProfile } from '../../hooks/user';

interface FollowButtonProps {
  playerName: string;
}

export const FollowButton = (props: FollowButtonProps) => {
  const { data: profile } = useSessionPlayerProfile();

  const toast = useToast();
  const { data: userIsFollowing, refetch } = useUserIsFollowingPlayer(
    props.playerName
  );

  const handleClick = useCallback(async () => {
    if (!profile?.email) {
      return signIn('google');
    }

    if (userIsFollowing) {
      const res = await deletePinnedPlayer(profile.email, props.playerName);

      if (res.error) {
        return toast({
          status: 'error',
          title: `Error unfollowing ${props.playerName}`,
          description: res.error.message,
        });
      }
    } else {
      const res = await addPinnedPlayer('', profile.email, props.playerName);

      if (res.error) {
        return toast({
          status: 'error',
          title: `Error following ${props.playerName}`,
          description: res.error.message,
        });
      }
    }

    await refetch();
  }, [profile?.email, refetch, toast, userIsFollowing, props.playerName]);

  if (profile?.name === props.playerName) return null;

  return (
    <Button
      size='xs'
      borderRadius={32}
      colorScheme='blue'
      variant={userIsFollowing ? 'outline' : 'solid'}
      onClick={handleClick}
    >
      {userIsFollowing ? 'Following' : 'Follow'}
    </Button>
  );
};
