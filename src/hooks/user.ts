import { useQuery } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { CombinedPlayerProfile, StoredPlayerProfile } from '../../types/player';
import supabase from '../lib/supabase/client';
import { fetchPlayers } from './finalResults/fetch';
import { useLiveTournamentResults } from './tournamentResults';

export const useUserMatchesLoggedInUser = (name: string | null | undefined) => {
  const { data: profile } = usePlayerProfile({ name });

  if (!name || !profile?.name) return false;
  return (
    profile.name === name ||
    !!profile.additional_names?.some(additionalName => additionalName === name)
  );
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
    .select('id,name,email,username,additional_names')
    .eq('email', session.user?.email);
  const playerProfile = data?.[0];

  if (playerProfile) {
    return {
      id: playerProfile?.id,
      name: playerProfile?.name,
      email: session.user?.email,
      image: session.user?.image,
      username: playerProfile.username,
      additional_names: playerProfile.additional_names ?? [],
    };
  }

  return null;
};

const fetchAllUserProfiles = async () => {
  const { data } = await supabase
    .from('Player Profiles')
    .select('id,name,email,username,additional_names,preferred_name')
    .order('username', { ascending: true });

  return data;
};

export const usePlayerProfiles = () => {
  return useQuery({
    queryKey: ['player-profiles'],
    queryFn: fetchAllUserProfiles,
  });
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
  const res = await supabase
    .from('Player Profiles')
    .select('id,name,email,additional_names');

  const players = await fetchPlayers();

  return players?.filter(
    name =>
      !res.data?.some(
        profile =>
          normalizeName(profile.name) === normalizeName(name) ||
          (profile.additional_names &&
            profile.additional_names.some(
              (additionalName: string) =>
                normalizeName(additionalName) === normalizeName(name)
            ))
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

export const fetchPlayerProfile = async (
  filters?: PlayerProfileFilters
): Promise<CombinedPlayerProfile | null> => {
  let query = supabase
    .from('Player Profiles')
    .select('id,name,email,username,additional_names,preferred_name');

  if (filters?.username) {
    query = query.ilike('username', filters.username);
  }
  const res = await query;

  let user: CombinedPlayerProfile | null = null;

  if (filters?.name) {
    user =
      res.data?.find(
        ({ name, additional_names }) =>
          name === filters?.name || additional_names?.includes(filters?.name)
      ) ?? null;
  } else {
    user = res.data?.[0] ?? null;
  }

  return user;
};

export const fetchAllTakenUsernames = async () => {
  const res = await supabase.from('Player Profiles').select('username');
  return (
    res.data?.map(({ username }) => username).filter(username => username) ??
    null
  );
};

export const useAllTakenUsernames = () => {
  return useQuery({
    queryKey: ['all-taken-usernames'],
    queryFn: () => fetchAllTakenUsernames(),
  });
};

interface PlayerProfileFilters {
  username?: string;
  name?: string | null;
}

export const usePlayerProfile = (filters?: PlayerProfileFilters) => {
  return useQuery({
    queryKey: ['player-profile', filters?.username, filters?.name],
    queryFn: () => fetchPlayerProfile(filters),
  });
};
