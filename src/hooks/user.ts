import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { fetchServerSideTwitterProfile } from '../../pages/api/get-twitter-profile';
import { StoredPlayerProfile, TwitterPlayerProfile } from '../../types/player';
import supabase from '../lib/supabase/client';
import { fetchTwitterProfile } from './twitter';

export const useUserMatchesLoggedInUser = (name: string) => {
  const session = useSession();
  return session.data?.user.name === name;
};

export const fetchUserProfile = async (
  username: string | undefined,
  options?: { prefetch: boolean }
) => {
  const { data } = await supabase
    .from('Player Profiles')
    .select('id,name,twitter_handle,tournament_history')
    .eq('twitter_handle', username);
  const playerProfile = data?.[0];

  let twitterProfile: TwitterPlayerProfile | undefined;

  if (options?.prefetch) {
    twitterProfile = await fetchServerSideTwitterProfile({ username });
  } else {
    twitterProfile = await fetchTwitterProfile({ username });
  }

  if (playerProfile && twitterProfile) {
    return {
      id: playerProfile?.id as string,
      name: playerProfile?.name as string,
      tournamentHistory: playerProfile?.tournament_history as string[],
      username: twitterProfile?.username as string,
      description: twitterProfile?.description as string,
      profile_image_url: twitterProfile?.profile_image_url as string,
    };
  }

  return null;
};

export const useSessionUserProfile = (options?: { prefetch: boolean }) => {
  const session = useSession();

  return useQuery({
    queryKey: [`session-user-profile`, session.data?.user.username],
    queryFn: () => fetchUserProfile(session.data?.user.username, options),
  });
};

export const fetchSuggestedUserProfile = async (name: string) => {
  const { data } = await supabase
    .from('Player Profiles')
    .select('id,name,twitter_handle,tournament_history')
    .eq('name', name);
  const playerProfile: StoredPlayerProfile | undefined = data?.[0];
  return playerProfile;
};

/**
 * Suggested user profile based on name
 */
export const useSuggestedUserProfile = () => {
  const session = useSession();
  const name = session.data?.user.name ?? '';

  return useQuery({
    queryKey: [`suggested-user-profile`, name],
    queryFn: () => fetchSuggestedUserProfile(name),
  });
};

export const useAccountRequests = () => {
  const fetchUserAccountRequests = async () => {
    const { data } = await supabase.from('Account Requests').select('*');
    return data;
  };

  return useQuery({
    queryKey: [`fetch-user-account-requests`],
    queryFn: fetchUserAccountRequests,
  });
};

export const useUserSentAccountRequest = (username: string | undefined) => {
  const fetchUserSentAccountRequest = async (username: string) => {
    const { data } = await supabase
      .from('Account Requests')
      .select('*')
      .eq('twitter_handle', username);
    if (data?.length && data.length > 0) {
      return true;
    }
    return false;
  };

  return useQuery({
    queryKey: [`user-sent-account-request`],
    queryFn: () => (username ? fetchUserSentAccountRequest(username) : {}),
  });
};

// For admin view
export const useNotSetupProfiles = () => {
  const fetchAllPlayerProfiles = async () => {
    const res = await supabase
      .from('Player Profiles')
      .select('id,name,twitter_handle,tournament_history')
      .is('twitter_handle', null);
    return res.data;
  };

  return useQuery({
    queryKey: [`all-player-profiles`],
    queryFn: fetchAllPlayerProfiles,
  });
};
