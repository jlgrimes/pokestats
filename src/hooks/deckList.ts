import { useQuery } from '@tanstack/react-query';
import { Card, Deck } from '../../types/tournament';
import { LiveResults } from '../lib/fetch/fetchLiveResults';

export const useCodeToSetMap = (): Record<string, string> => {
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