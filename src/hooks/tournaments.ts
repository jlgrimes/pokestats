import { useQuery } from '@tanstack/react-query';

export const fetchTournaments = async (options?: { prefetch?: boolean }) => {
  const data = await fetch(
    `${
      options?.prefetch ? 'https://pokedata.ovh' : '/pokedata'
    }/standings/tournaments.json`
  ).then(res => res.json());

  return data;
};

export const useTournaments = (options?: { prefetch?: boolean }) => {
  return useQuery({
    queryKey: ['tournaments'],
    queryFn: () => fetchTournaments(options),
  });
};
