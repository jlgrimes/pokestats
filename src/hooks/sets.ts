import { useQuery } from '@tanstack/react-query';
import { differenceInDays } from 'date-fns';
import { Tournament } from '../../types/tournament';
import { tournamentHasArrivedButNotLive } from '../components/TournamentList/helpers';

export const fetchSets = async () => {
  const res = await fetch(
    'https://api.pokemontcg.io/v2/sets/?select=name,ptcgoCode,releaseDate'
  );
  const data = await res.json();
  const sets = data.data;
  return sets;
};

export const useSets = () => {
  return useQuery({
    queryKey: [`sets`],
    queryFn: fetchSets,
  });
};

export interface TournamentOrSet {
  type: string;
  data: Record<string, any>;
}

export const useTournamentRender = (
  tournaments: Tournament[]
): TournamentOrSet[] => {
  const sets = useSets();

  if (!sets.data)
    return tournaments.map(tournament => ({
      type: 'tournament',
      data: tournament,
    }));

  const parsedSets: any[] = sets.data
    ?.sort((a: Record<string, any>, b: Record<string, any>) => {
      const aDate = new Date(a.releaseDate);
      const bDate = new Date(b.releaseDate);

      if (aDate < bDate) {
        return -1;
      } else if (bDate < aDate) {
        return 1;
      }
      return 0;
    })
    .filter(
      ({ name }: { name: string }) =>
        !name.includes('Collection') && !name.includes('Gallery')
    );
  const startingSet = 'Astral Radiance';

  let setIdx = parsedSets?.findIndex(({ name }) => name === startingSet);

  const result = tournaments
    .slice()
    .reverse()
    .reduce((acc: TournamentOrSet[], tournament) => {
      const releaseDate = new Date(parsedSets[setIdx]?.releaseDate);
      releaseDate.setDate(releaseDate.getDate() + 13);
      if (new Date(tournament.date.start) >= releaseDate) {
        setIdx += 1;
        return [
          ...acc,
          { type: 'set', data: parsedSets[setIdx - 1] },
          { type: 'tournament', data: tournament },
        ];
      }

      return [...acc, { type: 'tournament', data: tournament }];
    }, []);
  return result.slice().reverse();
};
