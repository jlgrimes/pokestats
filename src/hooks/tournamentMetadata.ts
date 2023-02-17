import { useQuery } from '@tanstack/react-query';
import supabase from '../lib/supabase/client';

export const fetchTournamentMetadata = async (tournamentId: string) => {
  const res = await supabase
    .from('Tournament Metadata')
    .select('tournament,type,data')
    .eq('tournament', tournamentId);

  return res.data;
};

export const useTournamentMetadata = (tournamentId: string) => {
  return useQuery({
    queryKey: ['tournament-metadata', tournamentId],
    queryFn: () => fetchTournamentMetadata(tournamentId),
  });
};

export const useStreamLink = (tournamentId: string) => {
  const { data: tournamentMetadata, ...rest } =
    useTournamentMetadata(tournamentId);
  return {
    data: tournamentMetadata?.find(({ type }) => type === 'stream')?.data ?? '',
    ...rest,
  };
};

export const useLocation = (tournamentId: string) => {
  const { data: tournamentMetadata, ...rest } =
    useTournamentMetadata(tournamentId);

  const data = tournamentMetadata?.find(
    ({ type }) => type === 'location'
  )?.data;

  return {
    data: data ? JSON.parse(data) : undefined,
    ...rest,
  };
};
