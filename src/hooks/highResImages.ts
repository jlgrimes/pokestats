import { useQuery } from 'react-query';
import { getHighResSpriteUrl } from '../components/common/helpers';

export const usePokedex = () => {
  const fetchPokedex = async () => {
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

  return useQuery(`pokedex`, fetchPokedex);
};

export const useHighResImageUrls = (pokemonNames: string[]) => {
  const { data } = usePokedex();
  return pokemonNames?.reduce((acc, name) => {
    return {
      ...acc,
      [name]: getHighResSpriteUrl(data?.[name.toLowerCase()])
    };
  }, {});
};
