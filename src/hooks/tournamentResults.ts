import { useQueries, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { PlayerTournamentPerformance } from '../../types/player';
import { Standing } from '../../types/tournament';
import { StandingsFilters } from '../components/Tournament/Results/Filters/StandingsFilterMenu';
import {
  fetchLiveResults,
  FetchLiveResultsOptions,
  FetchLoggedInPlayerOptions,
  LiveResults,
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

const applyFilters = (liveResults: LiveResults, filters?: StandingsFilters) => {
  if (!filters) return liveResults;

  if (filters.decksVisible.length > 0) {
    return {
      ...liveResults,
      data: liveResults.data.filter(
        ({ deck }) => deck && deck.id && filters.decksVisible.includes(deck.id)
      ),
    };
  }

  if (filters.justDay2.value) {
    return {
      ...liveResults,
      data: liveResults.data.filter(
        ({ record }) => record.wins * 3 + record.ties >= 19
      ),
    };
  }

  return liveResults;
};

export const useLiveTournamentResults = (
  tournamentId: string,
  options?: FetchLiveResultsOptions
) => {
  const query = useQuery({
    queryKey: [
      `live-results`,
      tournamentId,
      ...(Object.entries(options?.load ?? {}).length > 0
        ? Object.entries(options?.load ?? {})
        : [[]])[0],
    ],
    queryFn: () => fetchLiveResults(tournamentId, options),
  });

  if (query.data) {
    return {
      ...query,
      data: applyFilters(query.data, options?.filters),
    };
  }

  return query;
};

export const useTopPerformingPlayers = (tournamentId: string) => {
  const { data: liveTournamentResults } =
    useLiveTournamentResults(tournamentId);
  return liveTournamentResults?.data.slice(0, 4).map(player => ({
    name: player.name,
    deck: player.deck,
    email: player.profile?.email,
  }));
};

export const usePlayerLiveResults = (
  tournamentId: string,
  name: string,
  options?: FetchLoggedInPlayerOptions
): {
  player: Standing | undefined;
  shouldHideDecks: boolean | undefined;
} => {
  const { data: liveResults } = useLiveTournamentResults(tournamentId, {
    load: { allRoundData: true },
  });
  const player = liveResults?.data.find(
    (result: Standing) => result.name === name
  );

  if (options?.load?.opponentRoundData && player?.rounds) {
    return {
      player: {
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
      },
      shouldHideDecks: liveResults?.shouldHideDecks,
    };
  }

  return {
    player,
    shouldHideDecks: liveResults?.shouldHideDecks,
  };
};

export const usePlayerPerformance = (
  playerName: string | undefined,
  tournamentHistory: string[] | undefined
): PlayerTournamentPerformance[] => {
  const { data: tournaments } = useTournaments();
  const sortedTournamentHistory = tournamentHistory?.sort(
    (a: string, b: string) => {
      if (parseInt(a) < parseInt(b)) {
        return 1;
      }
      if (parseInt(a) > parseInt(b)) {
        return -1;
      }

      return 0;
    }
  );

  const queries =
    sortedTournamentHistory?.map(tournamentId => {
      return {
        queryKey: [`live-results`, tournamentId],
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
