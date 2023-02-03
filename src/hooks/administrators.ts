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
  const email = session.data?.user?.email;
  const { data: administrators } = useAdministrators();

  return {
    isLoading: !email || email.length === 0 || !administrators,
    data: administrators?.some(admin => admin.email === email) ?? false,
  };
};

export const fetchAllReportActivity = async () => {
  const { data } = await supabase
    .from('Player Decks')
    .select('created_at,player_name,tournament_id,user_who_submitted')
    .order('created_at', { ascending: false });
  return data;
};

export const useAllReportActivity = () => {
  return useQuery({
    queryKey: ['all-report-activity'],
    queryFn: fetchAllReportActivity,
  });
};
