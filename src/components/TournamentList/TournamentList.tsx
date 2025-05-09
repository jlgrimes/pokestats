import { Box, Grid, Text } from '@chakra-ui/react';
import { Tournament } from '../../../types/tournament';
import { TournamentCard } from './TournamentCard';
import { useChampions } from '../../hooks/newStandings';
import { isBefore, parseISO } from 'date-fns';
import { TopDecks } from '../Home/TopDecks';

export const TournamentList = ({
  tournaments,
  mostRecent,
}: {
  tournaments: Tournament[];
  mostRecent?: boolean;
}) => {
  const { data: champions } = useChampions();

  const liveTournaments = (tournaments.filter((tournament) => tournament.tournamentStatus === 'running'));
  const upcomingTournaments = (tournaments.filter((tournament) => tournament.tournamentStatus === 'not-started')).sort((a, b) => {
    if (isBefore(parseISO(a.date.start), parseISO(b.date.start))) return -1;
    if (isBefore(parseISO(b.date.start), parseISO(a.date.start))) return 1;
    return 0;
  });
  const finishedTournaments = (tournaments.filter((tournament) => tournament.tournamentStatus === 'finished'));

  return (
    <>
    {liveTournaments.map((tournament) => (
      <div className='flex flex-col gap-2' key={`tournament-card-${tournament.id}`}>
        <TournamentCard
          tournament={tournament}
          champion={undefined}
        />
        {tournament.should_reveal_decks?.masters && <TopDecks tournament={tournament} />}
      </div>
    ))}
    {upcomingTournaments.slice(0, 2).map((tournament) => (
      <TournamentCard
        key={`tournament-card-${tournament.id}`}
        tournament={tournament}
        champion={champions ? champions.find((standing) => standing.tournament_id === parseInt(tournament.id)) : undefined}
      />
    ))}
    {
      finishedTournaments.slice(0, mostRecent ? 3 : -1).map((tournament) => (
        <div className='flex flex-col gap-2' key={`tournament-card-${tournament.id}`}>
          <TournamentCard
            tournament={tournament}
            champion={champions ? champions.find((standing) => standing.tournament_id === parseInt(tournament.id)) : undefined}
          />
        </div>
      ))
    }</>
  );
};
