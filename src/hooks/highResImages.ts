import { useQuery } from '@tanstack/react-query';
import {
  getHighResSpriteUrl,
  getRegionFlag,
  removeRegionFlag,
} from '../components/common/helpers';

export const fetchPokedex = async () => {
  const res = await fetch(
    'https://pokeapi.co/api/v2/pokemon-species?limit=5000'
  );
  const data = await res.json();
  return data.results.reduce(
    (acc: Record<string, number>, pokemon: Record<string, string>) => {
      return {
        ...acc,
        [pokemon.name]: pokemon.url
          .split('https://pokeapi.co/api/v2/pokemon-species/')[1]
          .split('/')[0],
      };
    },
    {}
  );
};

export const usePokedex = () => {
  return useQuery({ queryKey: [`pokedex`], queryFn: fetchPokedex });
};

export const useHighResImageUrls = (pokemonNames: string[]): Record<string, string> => {
  const { data } = usePokedex();
  return pokemonNames?.reduce((acc, name) => {
    return {
      ...acc,
      [name]: getHighResSpriteUrl(
        data?.[removeRegionFlag(name).toLowerCase()],
        getRegionFlag(name)
      ),
    };
  }, {});
};
