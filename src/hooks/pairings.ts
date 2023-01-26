import { useQuery } from '@tanstack/react-query';
import supabase from '../lib/supabase/client';

export const fetchPairingSubmissions = async (tournamentId: string) => {
  const res = await supabase
    .from('Final Results')
    .select(`deck_id,player1_name,player2_name,user_who_submitted,table_number`)
    .eq('tournament_id', tournamentId);
  return res.data;
};

export const usePairingSubmissions = (tournamentId: string) => {
  return useQuery({
    queryKey: ['pairings'],
    queryFn: () => fetchPairingSubmissions(tournamentId),
  });
};
