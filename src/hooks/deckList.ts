import { useQuery } from '@tanstack/react-query';

export const useCodeToSetMap = () => {
  const { data: sets } = useQuery({
    queryKey: ['https://api.pokemontcg.io/v2/sets/'],
    queryFn: () =>
      fetch('https://api.pokemontcg.io/v2/sets/').then(res => res.json()),
  });

  return sets?.data?.reduce((acc: Record<string, string>, set: Record<string, any>) => {
    // TODO: stupid fix for trainer gallery please actually change this
    if (acc[set.ptcgoCode]) {
      return acc;
    }

    return {
      ...acc,
      [set.ptcgoCode]: set.id,
    }
  }, {});
};
