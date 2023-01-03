import { useQuery } from '@tanstack/react-query';
import { Tournament } from '../../types/tournament';

export const fetchTournaments = async (options?: {
  prefetch?: boolean;
}) => {
  const res: Response = await fetch(
    `${
      options?.prefetch ? 'https://pokedata.ovh' : '/pokedata'
    }/standings/tournaments.json`
  );
  const data: Tournament[] = await res.json();

  return data.reverse();
};

export const useTournaments = (options?: { prefetch?: boolean }) => {
  return useQuery({
    queryKey: ['tournaments'],
    queryFn: () => fetchTournaments(options),
  });
};
