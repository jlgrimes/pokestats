import { useQuery } from '@tanstack/react-query';
import { fetchLiveResults } from '../lib/fetch/fetchLiveResults';
import { getResultQueryKey } from '../lib/fetch/query-keys';
import supabase from '../lib/supabase/client';
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
    .map(({ name, deck }: { name: string; deck: Record<string, any> }) => ({
      name,
      deck,
    }));
};

export const useLoggedInPlayerLiveResults = (tournamentId: string) => {
  const { data: liveResults } = useLiveTournamentResults(tournamentId);
  const { data: username } = useTwitterUsername();

  return liveResults?.data.find(
    (result: Record<string, any>) => result.profile?.twitterHandle === username
  );
};
