import { useQuery } from '@tanstack/react-query';
import supabase from '../lib/supabase/client';

export const fetchTournamentMetadata = async (
  tournamentId: string,
  type: string
) => {
  const res = await supabase
    .from('Tournament Metadata')
    .select('tournament,type,data')
    .eq('tournament', tournamentId)
    .eq('type', type);

  return res.data;
};

export const useTournamentMetadata = (tournamentId: string, type: string) => {
  return useQuery({
    queryKey: ['tournament-metadata', tournamentId, type],
    queryFn: () => fetchTournamentMetadata(tournamentId, type),
  });
};
