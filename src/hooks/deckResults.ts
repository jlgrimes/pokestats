import { useQuery } from '@tanstack/react-query';
import supabase from '../lib/supabase/client';

interface FetchDeckResultsOptions {
  archetype?: number;
  supertype?: {
    id: number;
    format: number;
  };
}

export const fetchDeckResults = async (options: FetchDeckResultsOptions) => {
  let query = supabase.from('Deck Results').select('opponent_deck,result');

  if (options.archetype) {
    query = query.eq('deck_archetype', options.archetype);
  }

  if (options.supertype) {
    query = query
      .eq('deck_archetype.supertype', options.supertype.id)
      .eq('tournament_id.format', options.supertype.format);
  }

  const res = await query;

  return res.data ?? null;
};

export const useDeckResults = (options: FetchDeckResultsOptions) => {
  const { data, ...rest } = useQuery({
    queryKey: ['deck-results', options],
    queryFn: () => fetchDeckResults(options),
  });

  return {
    data,
    ...rest,
  };
};
