import { useUser } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { Standing } from '../../types/tournament';
import supabase from '../lib/supabase/client';
import { useLiveTournamentResults } from './tournamentResults';

export const fetchPinnedPlayers = async (
  tournamentId?: string,
  userAccountEmail?: string
) => {
  let query = supabase
    .from('Pinned Players')
    .select('pinned_player_name,user_account');

  if (tournamentId) {
    query = query.eq('tournament_id', tournamentId);
  }

  if (userAccountEmail) {
    query = query.eq('user_account', userAccountEmail);
  }

  const res = await query;
  return res.data;
};

export const useAllPinnedPlayers = (tournamentId?: string, name?: string) => {
  return useQuery({
    queryKey: ['all-pinned-players'],
    queryFn: () => fetchPinnedPlayers(tournamentId, name),
  });
};

export const usePinnedPlayers = (tournamentId?: string) => {
  const user = useUser();
  const { data, ...rest } = useAllPinnedPlayers(tournamentId, user?.email);

  const filteredPlayers = data?.filter(
    pinnedPlayer => pinnedPlayer.user_account === user?.email
  );

  const pinnedPlayers = filteredPlayers?.filter(
    ({ pinned_player_name }, idx) => {
      const foundIdx = filteredPlayers?.findIndex(
        entry => entry.pinned_player_name === pinned_player_name
      );

      if (idx === foundIdx || foundIdx < 0) return true;

      return false;
    }
  );

  return {
    data: pinnedPlayers?.map(pinnedPlayer => pinnedPlayer.pinned_player_name),
    ...rest,
  };
};

export const useUserIsFollowingPlayer = (playerName: string) => {
  const user = useUser();
  const email = user?.email;
  const { data, ...rest } = useAllPinnedPlayers(undefined, email ?? undefined);

  return {
    data: !email
      ? false
      : data
      ? data.some(player => player.pinned_player_name === playerName)
      : null,
    ...rest,
  };
};

export const useMostPopularPinned = () => {
  const { data: pinnedPlayers } = useAllPinnedPlayers();

  const popular: Record<string, number> | undefined = pinnedPlayers?.reduce(
    (acc: Record<string, number>, curr) => {
      if (acc[curr.pinned_player_name]) {
        return {
          ...acc,
          [curr.pinned_player_name]: acc[curr.pinned_player_name] + 1,
        };
      }

      return {
        ...acc,
        [curr.pinned_player_name]: 1,
      };
    },
    {}
  );

  if (!popular) return null;

  return Object.entries(popular).sort((a, b) => {
    if (a[1] < b[1]) return 1;
    if (a[1] > b[1]) return -1;
    return 0;
  });
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
    usePinnedPlayers();
  const { data: liveResults, isLoading: isLiveTournamentResultsLoading } =
    useLiveTournamentResults(tournamentId, { load: { allRoundData: true } });

  return {
    data: liveResults?.data.reduce((acc: string[], curr: Standing) => {
      if (pinnedPlayers?.some(name => name === curr.name)) return acc;

      return [...acc, curr.name];
    }, []),
    isLoading: isPinnedPlayersLoading || isLiveTournamentResultsLoading,
  };
};
