import { useQuery } from '@tanstack/react-query';
import { Standing } from '../../types/tournament';
import { StandingsFilters } from '../components/Tournament/Results/Filters/StandingsFilterMenu';
import {
  fetchLiveResults,
  FetchLiveResultsOptions,
  FetchLoggedInPlayerOptions,
  LiveResults,
  Player,
} from '../lib/fetch/fetchLiveResults';
import { getResultQueryKey } from '../lib/fetch/query-keys';
import supabase from '../lib/supabase/client';
import { useSessionPlayerProfile } from './user';

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
  let ret = liveResults;

  if (filters.decksVisible.length > 0) {
    ret = {
      ...liveResults,
      data: ret.data.filter(
        ({ deck }) => deck && deck.id && filters.decksVisible.includes(deck.id)
      ),
    };
  }

  if (filters.supertypesVisible.length > 0) {
    ret = {
      ...liveResults,
      data: ret.data.filter(
        ({ deck }) => {
          return deck && ((deck.supertype &&filters.supertypesVisible.includes(deck.supertype.id)) || (filters.supertypesVisible.some((supertype) => supertype === -1) && !deck.supertype))
        }
      ),
    };
  }

  if (filters.justDay2.value) {
    ret = {
      ...liveResults,
      data: ret.data.filter(
        ({ record }) => record.wins * 3 + record.ties >= 19
      ),
    };
  }

  if (filters.onStream.value) {
    ret = {
      ...liveResults,
      data: ret.data.filter(({ deck }) => deck?.on_stream),
    };
  }

  if (filters.deckKnown.value) {
    ret = {
      ...liveResults,
      data: ret.data.filter(({ deck }) => deck?.id),
    };
  }

  return ret;
};

export const useLiveTournamentResults = (
  tournamentId: string,
  options?: FetchLiveResultsOptions
) => {
  const queryKey = [
    `live-results`,
    tournamentId,
    ...(Object.entries(options?.load ?? {}).length > 0
      ? Object.entries(options?.load ?? {})
      : [[]])[0],
  ];
  const query = useQuery({
    queryKey,
    queryFn: () =>
      fetchLiveResults(tournamentId, options),
    enabled: !options?.shouldNotFetchData
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

export interface PlayerLiveResultsSchema {
  player: Standing | undefined;
  shouldHideDecks: boolean | undefined;
  isLoading: boolean;
}

export const usePlayerLiveResults = (
  tournamentId: string,
  name?: string | null,
  options?: FetchLoggedInPlayerOptions
): PlayerLiveResultsSchema => {
  const { data: liveResults, isLoading } = useLiveTournamentResults(
    tournamentId,
    {
      load: { allRoundData: true },
    }
  );

  if (!name)
    return {
      player: undefined,
      shouldHideDecks: undefined,
      isLoading,
    };

  const player = liveResults?.data.find(
    (result: Standing) =>
      result.name === name ||
      (options?.additionalNames &&
        options.additionalNames.includes(result.name))
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
      isLoading,
    };
  }

  return {
    player,
    shouldHideDecks: liveResults?.shouldHideDecks,
    isLoading,
  };
};

export const useLiveTournamentPlayers = (tournamentId: string) => {
  const { data: liveResults, isLoading: isLiveTournamentResultsLoading } =
    useLiveTournamentResults(tournamentId, { load: { allRoundData: true } });

  return {
    data: liveResults?.data.map(({ name }) => name),
    isLoading: isLiveTournamentResultsLoading,
  };
};

export const usePlayerIsMeOrMyOpponent = (player: Standing | undefined) => {
  const { data: profile } = useSessionPlayerProfile();
  const userName = profile?.name;

  if (!player) return true;
  if (!userName) return false;
  if (!player.rounds) return false;

  if (player.name === userName) return true;
  return player.rounds.some(({ name }) => name === userName);
};
