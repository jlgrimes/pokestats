import { useQuery } from '@tanstack/react-query';
import supabase from '../lib/supabase/client';

export const useTournaments = () => {
  const fetchTournaments = async () => {
    const res = await supabase.from('Tournaments').select('id,name');
    return res.data;
  };

  return useQuery({
    queryKey: ['tournaments'],
    queryFn: fetchTournaments,
  });
};