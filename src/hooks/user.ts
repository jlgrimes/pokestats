import { useQuery } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { fetchServerSideTwitterProfile } from '../../pages/api/get-twitter-profile';
import { StoredPlayerProfile, TwitterPlayerProfile } from '../../types/player';
import supabase from '../lib/supabase/client';
import { fetchTwitterProfile } from './twitter';

export const useUserMatchesLoggedInUser = (name: string) => {
  const session = useSession();
  return session.data?.user.name === name;
};

export const fetchUserProfile = async (session: Session) => {
  const { data } = await supabase
    .from('Player Profiles')
    .select('id,name,email,tournament_history')
    .eq('email', session.user.email);
  const playerProfile = data?.[0];

  let twitterProfile: TwitterPlayerProfile | undefined;

  if (playerProfile && twitterProfile) {
    return {
      id: playerProfile?.id as string,
      name: playerProfile?.name as string,
      tournamentHistory: playerProfile?.tournament_history as string[],
      email: session.user.email,
      image: session.user.image,
    };
  }

  return null;
};

export const useSessionUserProfile = () => {
  const session = useSession();

  return useQuery({
    queryKey: [`session-user-profile`, session.data?.user.email],
    queryFn: () => fetchUserProfile(session.data as Session),
  });
};

export const fetchSuggestedUserProfile = async (name: string) => {
  const { data } = await supabase
    .from('Player Profiles')
    .select('id,name,email,tournament_history')
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
      .eq('email', username);
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
      .select('id,name,email,tournament_history')
      .is('email', null);
    return res.data;
  };

  return useQuery({
    queryKey: [`all-player-profiles`],
    queryFn: fetchAllPlayerProfiles,
  });
};

export const fetchAllVerifiedUsers = async () => {
  const res = await supabase
    .from('Player Profiles')
    .select('id,name,email,tournament_history')
    .neq('email', null);
  return res.data;
};

export const fetchUser = async (username: string) => {
  const res = await supabase
    .from('Player Profiles')
    .select('id,name,email,tournament_history')
    .eq('email', username);
  return res.data?.[0];
};
