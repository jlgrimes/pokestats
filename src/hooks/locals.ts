import supabase from '../lib/supabase/client';

interface FetchLocalTournamentsFilters {
  id?: number;
}

export interface LocalTournament {
  id: number;
  name: string;
  format: number;
  tournament_type: string;
}

export const fetchLocalTournaments = async (
  filters?: FetchLocalTournamentsFilters
): Promise<LocalTournament[] | null> => {
  let query = supabase
    .from('Local Tournaments')
    .select('id,name,format,tournament_type');

  if (filters?.id) {
    query = query.eq('id', filters.id);
  }

  const res = await query.returns<LocalTournament[]>();
  return res?.data;
};
