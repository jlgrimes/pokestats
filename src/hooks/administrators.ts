import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
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

export const useUserIsAdmin = () => {
  const { data: session } = useSession();
  const administrators = useAdministrators();
  return (
    administrators.data?.some(admin => admin.email === session?.user?.email) ??
    false
  );
};
