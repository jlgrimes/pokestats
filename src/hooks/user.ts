import { useQuery } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { StoredPlayerProfile } from '../../types/player';
import supabase from '../lib/supabase/client';

export const useUserMatchesLoggedInUser = (name: string) => {
  const session = useSession();
  return session.data?.user.name === name;
};

export const fetchUserProfileFromEmail = async (email: string) => {
  const { data } = await supabase
    .from('Player Profiles')
    .select('id,name,email')
    .eq('email', email);
  const playerProfile = data?.[0];

  if (playerProfile) {
    return {
      id: playerProfile?.id as string,
      name: playerProfile?.name as string,
      email: email,
    };
  }

  return null;
};

export const fetchUserProfile = async (session: Session) => {
  const { data } = await supabase
    .from('Player Profiles')
    .select('id,name,email')
    .eq('email', session.user.email);
  const playerProfile = data?.[0];

  if (playerProfile) {
    return {
      id: playerProfile?.id as string,
      name: playerProfile?.name as string,
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
    queryFn: () => {
      if (session.data) {
        return fetchUserProfile(session.data);
      }
      
      return null;
    },
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

const fetchUserSentAccountRequest = async (email: string) => {
  const { data } = await supabase
    .from('Account Requests')
    .select('*')
    .eq('email', email);
  if (data?.length && data.length > 0) {
    return true;
  }
  return false;
};

export const useUserSentAccountRequest = (email: string | undefined) => {
  return useQuery({
    queryKey: [`user-sent-account-request`],
    queryFn: () => (email ? fetchUserSentAccountRequest(email) : {}),
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
    .select('id,name,email')
  return res.data;
};

export const fetchUser = async (email: string) => {
  const res = await supabase
    .from('Player Profiles')
    .select('id,name,email')
    .eq('email', email);
  return res.data?.[0];
};
