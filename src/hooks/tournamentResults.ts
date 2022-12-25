import { useQueries, useQuery } from '@tanstack/react-query';
import { PlayerTournamentPerformance } from '../../types/player';
import { Standing } from '../../types/tournament';
import { fetchLiveResults } from '../lib/fetch/fetchLiveResults';
import { getResultQueryKey } from '../lib/fetch/query-keys';
import supabase from '../lib/supabase/client';
import { useTournaments } from './tournaments';
import { useTwitterUsername } from './twitter';

export const useTournamentResults = (tournamentName: string) => {
  const fetchResults = async () => {
    const res = await supabase
      .from('Tournament Results')
      .select('*')
      .eq('tournament_name', tournamentName);
    return res.data;
  };

  return useQuery({
    queryKey: [getResultQueryKey(tournamentName)],
    queryFn: fetchResults,
  });
};

export const useLiveTournamentResults = (tournamentId: string) => {
  return useQuery({
    queryKey: [`live-results-${tournamentId}`],
    queryFn: () => fetchLiveResults(tournamentId),
  });
};

export const useTopPerformingPlayers = (tournamentId: string) => {
  const { data: liveTournamentResults } =
    useLiveTournamentResults(tournamentId);
  return liveTournamentResults?.data
    .slice(0, 4)
    .map(
      ({
        name,
        deck,
        profile,
      }: {
        name: string;
        deck: Record<string, any>;
        profile: Record<string, any>;
      }) => ({
        name,
        deck,
        twitterHandle: profile.twitterHandle,
      })
    );
};

export const useLoggedInPlayerLiveResults = (tournamentId: string) => {
  const { data: liveResults } = useLiveTournamentResults(tournamentId);
  const { data: username } = useTwitterUsername();

  return liveResults?.data.find(
    (result: Record<string, any>) => result.profile?.twitterHandle === username
  );
};

export const usePlayerPerformance = (
  playerName: string | undefined,
  tournamentHistory: string[] | undefined
): PlayerTournamentPerformance[] => {
  const { data: tournaments } = useTournaments();
  const queries =
    tournamentHistory?.map(tournamentId => {
      return {
        queryKey: [`live-results-${tournamentId}`],
        queryFn: () => fetchLiveResults(tournamentId),
      };
    }) ?? [];

  const allTournamentDataRelevantToPlayer = useQueries({
    queries,
  });

  if (playerName === undefined || tournamentHistory === undefined) {
    return [];
  }

  const playerTournamentPerformance: PlayerTournamentPerformance[] =
    allTournamentDataRelevantToPlayer.reduce(
      (acc: any[], result, tournamentIdx) => {
        if (!result.data) {
          return acc;
        }

        // We run into the duplicate player name thing here
        const perf: Standing = result.data.data.find(
          (standing: Standing) => standing.name === playerName
        );

        return [
          ...acc,
          {
            tournament: tournaments?.find(
              ({ id }) => id === tournamentHistory[tournamentIdx]
            ),
            performance: perf,
          },
        ];
      },
      []
    );
  return playerTournamentPerformance;
};
