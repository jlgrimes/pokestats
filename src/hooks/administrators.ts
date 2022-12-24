import { useQuery } from '@tanstack/react-query';
import supabase from '../lib/supabase/client';

export const fetchAdministrators = async () => {
  const res = await supabase.from('Administrators').select('*');
  return res.data;
};

export const useAdministrators = () => {
  return useQuery({
    queryKey: ['administrators'],
    queryFn: fetchAdministrators,
  });
};
