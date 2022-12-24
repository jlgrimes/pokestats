import { useQuery } from '@tanstack/react-query';
import supabase from '../lib/supabase/client';

export const useNotablePlayers = (tournamentName: string) => {
  const fetchArchetypes = async () => {
    const res = await supabase
      .from('Notable Players')
      .select('player_name,deck_archetype')
      .eq('tournament_name', tournamentName);
    return res.data;
  };

  return useQuery({
    queryKey: [`notable-players-${tournamentName}`],
    queryFn: fetchArchetypes,
  });
};
