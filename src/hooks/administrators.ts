import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import supabase from '../lib/supabase/client';

export const fetchAdministrators = async () => {
  const res = await supabase.from('Administrators').select('email');
  return res.data;
};

export const useAdministrators = () => {
  return useQuery({
    queryKey: ['administrators'],
    queryFn: fetchAdministrators,
  });
};

export const useUserIsAdmin = () => {
  const session = useSession();
  const email = session.data?.user.email;
  const { data: administrators } = useAdministrators();

  return {
    isLoading: !email || email.length === 0 || !administrators,
    data:
      administrators?.some(admin => admin.email === email) ??
      false,
  };
};
