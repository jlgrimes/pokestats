import { useQuery } from '@tanstack/react-query';
import supabase from '../lib/supabase/client';

interface FinalResultsFilters {
  tournamentId?: number;
  deckId?: number;
  playerName?: string;
}

export const fetchFinalResults = async (filters?: FinalResultsFilters) => {
  let query = supabase.from('Final Results').select('*');

  if (filters?.tournamentId)
    query = query.eq('tournament_id', filters.tournamentId);
  if (filters?.deckId) query = query.eq('deck_archetype', filters.deckId);
  if (filters?.playerName) query = query.eq('name', filters.playerName);

  const { data: finalResultsData } = await query;
  return finalResultsData;
};

export const useFinalResults = (filters?: FinalResultsFilters) => {
  return useQuery({
    queryKey: ['final-results', ...Object.entries(filters ?? [])],
    queryFn: () => fetchFinalResults(filters),
  });
};
