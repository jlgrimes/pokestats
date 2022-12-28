import { useQueries, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { PlayerTournamentPerformance } from '../../types/player';
import { MatchupResult, Standing } from '../../types/tournament';
import {
  fetchLiveResults,
  FetchLiveResultsOptions,
  FetchLoggedInPlayerOptions,
} from '../lib/fetch/fetchLiveResults';
import { getResultQueryKey } from '../lib/fetch/query-keys';
import supabase from '../lib/supabase/client';
import { useTournaments } from './tournaments';

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

export const useLiveTournamentResults = (
  tournamentId: string,
  options?: FetchLiveResultsOptions
) => {
  return useQuery({
    queryKey: [
      `live-results-${tournamentId}`,
      ...Object.keys(options?.load ?? {}),
    ],
    queryFn: () => fetchLiveResults(tournamentId, options),
  });
};

export const useTopPerformingPlayers = (tournamentId: string) => {
  const { data: liveTournamentResults } =
    useLiveTournamentResults(tournamentId);
  return liveTournamentResults?.data.slice(0, 4).map(player => ({
    name: player.name,
    deck: player.deck,
    twitterHandle: player.profile.twitterHandle,
  }));
};

export const useLoggedInPlayerLiveResults = (
  tournamentId: string,
  options?: FetchLoggedInPlayerOptions
): Standing | undefined => {
  const { data: liveResults } = useLiveTournamentResults(tournamentId, {
    load: { roundData: true },
  });
  const session = useSession();
  const player = liveResults?.data.find(
    (result: Standing) =>
      result.profile?.twitterHandle === session.data?.user.username
  );

  if (options?.load?.opponentRoundData && player?.rounds) {
    return {
      ...player,
      rounds: player.rounds.map(roundResult => {
          const opponent = liveResults?.data.find(
            player => player.name === roundResult.name
          );

          if (opponent) {
            return {
              ...roundResult,
              opponent,
            };
          }

          return roundResult;
      }),
    };
  }

  return player;
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
        const perf = result.data.data.find(
          standing => standing.name === playerName
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
