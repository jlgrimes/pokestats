import { FinalResultsSchema } from '../../../types/final-results';
import { useFinalResults } from './useFinalResults';

export const useChampions = () => {
  const { data, ...rest } = useFinalResults({ placing: 1 });

  const champions: Record<string, FinalResultsSchema> | undefined =
    data?.reduce((acc, curr) => {
      if (curr.placing !== 1 || !curr.tournamentId) return acc;

      return {
        ...acc,
        [curr.tournamentId]: curr,
      };
    }, {});

  return {
    data: champions,
    ...rest,
  };
};
