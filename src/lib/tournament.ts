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

interface TournamentRoundSchema {
  dayOneSwissRounds: number;
  dayTwoSwissRounds: number;
  singleEliminationRounds: number;
  totalRoundLength: number;
}

export interface TournamentRoundMapSchema {
  playerRange: [number, number];
  rounds: TournamentRoundSchema;
}

// https://assets.pokemon.com//assets/cms2/pdf/play-pokemon/rules/play-pokemon-tournament-rules-handbook-02212023-en.pdf
// Section 4.6.3.3
const rawTwoDayTournamentStructureTable: [
  [number, number],
  number,
  number,
  number,
  number
][] = [
  [[4, 8], 3, 0, 0, 3],
  [[9, 12], 4, 0, 2, 6],
  [[13, 20], 5, 0, 2, 7],
  [[21, 32], 5, 0, 3, 8],
  [[33, 64], 6, 0, 3, 9],
  [[65, 128], 7, 0, 3, 10],
  [[129, 226], 8, 0, 3, 11],
  [[227, 799], 9, 5, 3, 17],
  [[800, 99999], 9, 6, 3, 18],
];

export const twoDayTournamentRoundSchemas: TournamentRoundMapSchema[] =
  rawTwoDayTournamentStructureTable.map(
    ([
      playerRange,
      dayOneSwissRounds,
      dayTwoSwissRounds,
      singleEliminationRounds,
      totalRoundLength,
    ]) => ({
      playerRange,
      rounds: {
        dayOneSwissRounds,
        dayTwoSwissRounds,
        singleEliminationRounds,
        totalRoundLength,
      },
    })
  );

export const getTournamentRoundSchema = (numberOfPlayers: number) =>
  twoDayTournamentRoundSchemas.find(
    schema =>
      numberOfPlayers > schema.playerRange[0] &&
      numberOfPlayers < schema.playerRange[1]
  );
