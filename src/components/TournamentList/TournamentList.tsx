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

  const liveTournaments = (tournaments.filter((tournament) => tournament.tournamentStatus === 'running'));
  const notLiveTournaments = (tournaments.filter((tournament) => tournament.tournamentStatus !== 'running'));
  const lastUpcomingTournament = tournaments.findLastIndex((tournament) => tournament.tournamentStatus === 'not-started');

  return (
    <>
    {liveTournaments.map((tournament) => (
      <TournamentCard
        key={`tournament-card-${tournament.id}`}
        tournament={tournament}
        champion={champions ? champions.find((standing) => standing.tournament_id === parseInt(tournament.id)) : undefined}
      />
    ))}
    {
      notLiveTournaments.slice(mostRecent ? lastUpcomingTournament : 0, mostRecent ? (lastUpcomingTournament + 5) : -1).map((tournament) => (
        <TournamentCard
          key={`tournament-card-${tournament.id}`}
          tournament={tournament}
          champion={champions ? champions.find((standing) => standing.tournament_id === parseInt(tournament.id)) : undefined}
        />
      ))
    }</>
  );
};
