import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import supabase from '../lib/supabase/client';
import { useTwitterUsernameFromId } from './twitter';

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
  const { data: session } = useSession();
  const { data: username } = useTwitterUsernameFromId(session?.user?.email as string);
  const { data: administrators } = useAdministrators();

  return (
    administrators?.some(admin => admin.twitter_username === username) ??
    false
  );
};
