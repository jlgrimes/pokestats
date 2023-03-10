import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { Standing } from '../../types/tournament';
import supabase from '../lib/supabase/client';
import { useLiveTournamentResults } from './tournamentResults';

export const fetchPinnedPlayers = async (tournamentId: string) => {
  const res = await supabase
    .from('Pinned Players')
    .select('pinned_player_name,user_account')
    .eq('tournament_id', tournamentId);

  return res.data;
};

export const useAllPinnedPlayers = (tournamentId: string) => {
  return useQuery({
    queryKey: ['all-pinned-players', tournamentId],
    queryFn: () => fetchPinnedPlayers(tournamentId),
  });
};

export const usePinnedPlayers = (tournamentId: string) => {
  const session = useSession();
  const { data, ...rest } = useAllPinnedPlayers(tournamentId);

  const user = session.data?.user?.email;

  return {
    data: data
      ?.filter(pinnedPlayer => pinnedPlayer.user_account === user)
      .map(pinnedPlayer => pinnedPlayer.pinned_player_name),
    ...rest,
  };
};

export const deletePinnedPlayer = async (
  userEmail: string,
  pinnedPlayerToRemove: string
) => {
  const res = await supabase
    .from('Pinned Players')
    .delete()
    .eq('user_account', userEmail)
    .eq('pinned_player_name', pinnedPlayerToRemove);
  return res;
};

export const addPinnedPlayer = async (
  tournamentId: string,
  userEmail: string,
  pinnedPlayerToAdd: string
) => {
  const res = await supabase.from('Pinned Players').insert({
    tournament_id: tournamentId,
    user_account: userEmail,
    pinned_player_name: pinnedPlayerToAdd,
  });
  return res;
};

export const useAvailablePinnedPlayerNames = (tournamentId: string) => {
  const { data: pinnedPlayers, isLoading: isPinnedPlayersLoading } =
    usePinnedPlayers(tournamentId);
  const { data: liveResults, isLoading: isLiveTournamentResultsLoading } =
    useLiveTournamentResults(tournamentId);

  return {
    data: liveResults?.data.reduce((acc: string[], curr: Standing) => {
      if (pinnedPlayers?.some(name => name === curr.name)) return acc;

      return [...acc, curr.name];
    }, []),
    isLoading: isPinnedPlayersLoading || isLiveTournamentResultsLoading,
  };
};
