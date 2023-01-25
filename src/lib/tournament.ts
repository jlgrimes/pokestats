import { getYear, parseISO } from 'date-fns';
import { Tournament } from '../../types/tournament';

export const shortenTournamentName = (tournament: Tournament) => {
  const tournamentStartYear = getYear(parseISO(tournament.date.start));
  const shortName = tournament.name
    .replace('Pokémon TCG', '')
    .replace('TCG', '')
    .replace(`${tournamentStartYear}`, '')
    .replace(/ +(?= )/g, '')
    .trim();

  return shortName;
};

export const getMostRecentCompletedTournamentIdx = (tournaments: Tournament[] | undefined) =>
  tournaments
    ? tournaments.length -
        tournaments
          ?.reverse()
          .findIndex(tournament => tournament.tournamentStatus === 'finished') -
        1 ?? 0
    : 0;
