import { useQuery } from '@tanstack/react-query';
import { FinalResultsFilters } from './final-results-schema';
import { fetchFinalResults } from './fetch';

export const useFinalResults = (filters?: FinalResultsFilters) => {
  return useQuery({
    queryKey: ['final-results', filters],
    queryFn: () => fetchFinalResults(filters),
  });
};
