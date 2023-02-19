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

export const reallyShortenTournamentName = (tournament: Tournament) => {
  const shortenedName = shortenTournamentName(tournament);

  return shortenedName
    .replace('Pokémon', '')
    .replace('Regional Championship', 'Regionals')
    .replace('International Championship', 'IC')
    .replace('World Championships', 'Worlds')
    .replace('Special Championship', 'SPE')
    .trim();
};

export const getMostRecentCompletedTournamentIdx = (
  tournaments: Tournament[] | undefined
) =>
  tournaments
    ? tournaments.length -
        tournaments
          ?.reverse()
          .findIndex(
            tournament => tournament.tournamentStatus === 'finished'
          ) ?? 0
    : 0;
