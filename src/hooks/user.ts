import { useQuery } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { StoredPlayerProfile, TwitterPlayerProfile } from '../../types/player';
import { fetchPlayerProfiles } from '../lib/fetch/fetchLiveResults';
import { fetchTwitterProfile } from './twitter';

export const useUserMatchesLoggedInUser = (name: string) => {
  const session = useSession();
  return session.data?.user.name === name;
};

const fetchSessionUserProfile = async (session: Session | null) => {
  const username = session?.user.username ?? '';

  const playerProfiles: Record<string, StoredPlayerProfile> | undefined =
    await fetchPlayerProfiles('twitter_handle');
  const twitterProfile: TwitterPlayerProfile | undefined =
    await fetchTwitterProfile({ username });
  const playerProfile = playerProfiles?.[username];

  if (playerProfile && twitterProfile) {
    return {
      id: playerProfile?.id as string,
      name: playerProfile?.name as string,
      tournamentHistory: playerProfile?.tournamentHistory as string[],
      username: twitterProfile?.username as string,
      description: twitterProfile?.description as string,
      profile_image_url: twitterProfile?.profile_image_url as string,
    };
  }

  return null;
};

export const useSessionUserProfile = () => {
  const session = useSession();

  return useQuery({
    queryKey: [`session-user-profile`],
    queryFn: () => fetchSessionUserProfile(session.data),
  });
};
