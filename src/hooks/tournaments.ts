import { useQuery } from '@tanstack/react-query';
import { LOCAL_TOURNAMENTS } from '../lib/sample-data';
import supabase from '../lib/supabase/client';

export const fetchTournaments = async () => {
  const data = await LOCAL_TOURNAMENTS.reverse();
  return { data };
};

export const useTournaments = () => {
  return useQuery({
    queryKey: ['tournaments'],
    queryFn: fetchTournaments,
  });
};