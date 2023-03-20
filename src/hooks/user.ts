import { useQuery } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { StoredPlayerProfile } from '../../types/player';
import supabase from '../lib/supabase/client';
import { fetchPlayers } from './finalResults/fetch';
import { useLiveTournamentResults } from './tournamentResults';

export const useUserMatchesLoggedInUser = (name: string | null | undefined) => {
  const session = useSession();

  if (!name || !session.data?.user?.name) return false;
  return session.data?.user?.name === name;
};

export const fetchUserProfileFromEmail = async (email: string) => {
  const { data } = await supabase
    .from('Player Profiles')
    .select('id,name,email')
    .eq('email', email);
  const playerProfile = data?.[0];

  if (playerProfile) {
    return {
      id: playerProfile?.id,
      name: playerProfile?.name,
      email: email,
    };
  }

  return null;
};

export const fetchUserProfile = async (session: Session) => {
  const { data } = await supabase
    .from('Player Profiles')
    .select('id,name,email')
    .eq('email', session.user?.email);
  const playerProfile = data?.[0];

  if (playerProfile) {
    return {
      id: playerProfile?.id,
      name: playerProfile?.name,
      email: session.user?.email,
      image: session.user?.image,
    };
  }

  return null;
};

export interface SessionUserProfile {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export const useSessionUserProfile = () => {
  const session = useSession();

  const query = useQuery({
    queryKey: [`session-user-profile`, session.data?.user?.email],
    queryFn: () => {
      if (session.data) {
        return fetchUserProfile(session.data);
      }

      return null;
    },
  });

  return {
    ...query,
    data: query.data,
    isLoading: session.status === 'loading' || query.isLoading,
  };
};

export const useUserIsInTournament = (
  tournamentId: string,
  playerName?: string
) => {
  const { data: liveResults } = useLiveTournamentResults(tournamentId, {
    load: { allRoundData: true },
  });

  return liveResults?.data.some(({ name }) => name === playerName);
};

export const useAccountRequests = () => {
  const fetchUserAccountRequests = async () => {
    const { data } = await supabase
      .from('Account Requests')
      .select('*')
      .order('created_at', { ascending: false });
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
    .select('entered_name')
    .eq('email', email);
  if (data?.length && data.length > 0) {
    return data[0].entered_name;
  }
  return null;
};

export const useUserSentAccountRequest = (email: string | null | undefined) => {
  return useQuery({
    queryKey: [`user-sent-account-request`],
    queryFn: () => (email ? fetchUserSentAccountRequest(email) : false),
  });
};

export const normalizeName = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const fetchUnusedPlayers = async () => {
  const res = await supabase.from('Player Profiles').select('id,name,email');

  const players = await fetchPlayers();

  return players?.filter(
    name =>
      !res.data?.some(
        profile => normalizeName(profile.name) === normalizeName(name)
      )
  );
};

// For admin view
export const useNotSetupProfiles = () => {
  return useQuery({
    queryKey: [`all-player-profiles`],
    queryFn: fetchUnusedPlayers,
  });
};

export const fetchAllVerifiedUsers = async () => {
  const res = await supabase.from('Player Profiles').select('id,name,email');
  return res.data;
};

export const fetchUser = async (email: string) => {
  const res = await supabase
    .from('Player Profiles')
    .select('id,name,email')
    .eq('email', email);
  return res.data?.[0];
};
