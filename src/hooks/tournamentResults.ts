import { useQuery } from 'react-query';
import { getResultQueryKey } from '../lib/fetch/query-keys';
import supabase from '../lib/supabase/client';

export const useTournamentResults = (tournamentName: string) => {
  const fetchResults = async () => {
    const res = await supabase
      .from('Tournament Results')
      .select('*')
      .eq('tournament_name', tournamentName);
    return res.data;
  };

  return useQuery(getResultQueryKey(tournamentName), fetchResults);
};

export const useLiveTournamentResults = (tournamentId: string) => {
  const url = `/api/live-results?id=${tournamentId}`;
  const fetchLiveResults = async () => {
    const res = await fetch(url);
    return res.json();
  };

  return useQuery(`live-results-${tournamentId}`, fetchLiveResults);
};
