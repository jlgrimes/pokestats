import { useQuery } from '@tanstack/react-query';
import supabase from '../lib/supabase/client';
import { useTwitterUsername } from './twitter';

export const fetchAdministrators = async () => {
  const res = await supabase.from('Administrators').select('twitter_username');
  return res.data;
};

export const useAdministrators = () => {
  return useQuery({
    queryKey: ['administrators'],
    queryFn: fetchAdministrators,
  });
};

export const useUserIsAdmin = () => {
  const { data: username } = useTwitterUsername();
  const { data: administrators } = useAdministrators();

  return {
    isLoading: !username || username.length === 0 || !administrators,
    data:
      administrators?.some(admin => admin.twitter_username === username) ??
      false,
  };
};
