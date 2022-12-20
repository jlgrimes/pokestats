import { useQuery } from 'react-query';
import supabase from '../lib/supabase/client';

export const useAdministrators = () => {
  const fetchAdministrators = async () => {
    const res = await supabase.from('Administrators').select('*');
    return res.data;
  };

  return useQuery('administrators', fetchAdministrators);
};
