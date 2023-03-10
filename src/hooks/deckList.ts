import { useQuery } from '@tanstack/react-query';

export const fetchCodeToSetMap = () =>
  fetch('https://api.pokemontcg.io/v2/sets/').then(res => res.json());

export const useCodeToSetMap = (): Record<string, string> => {
  const { data: sets } = useQuery({
    queryKey: ['code-to-set-map'],
    queryFn: () => fetchCodeToSetMap(),
  });

  return sets?.data?.reduce(
    (acc: Record<string, string>, set: Record<string, any>) => {
      // TODO: stupid fix for trainer gallery please actually change this
      if (acc[set.ptcgoCode]) {
        return acc;
      }

      return {
        ...acc,
        [set.ptcgoCode]: set.id,
      };
    },
    {}
  );
};
