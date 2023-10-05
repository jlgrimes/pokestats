import { Box, Grid, Text } from '@chakra-ui/react';
import { Tournament } from '../../../types/tournament';
import { useTournamentRender } from '../../hooks/sets';
import { TournamentCard } from './TournamentCard';
import { useChampions } from '../../hooks/newStandings';

export const TournamentList = ({
  tournaments,
  mostRecent,
}: {
  tournaments: Tournament[];
  mostRecent?: boolean;
}) => {
  const { data: champions } = useChampions();
  const items = useTournamentRender(tournaments, mostRecent);

  return (
    <>{
      tournaments.map((tournament) => (
        <TournamentCard
          key={`tournament-card-${tournament.id}`}
          tournament={tournament}
          champion={champions ? champions.find((standing) => standing.tournament_id === tournament.id) : undefined}
        />
      ))
    }</>
  );
};
