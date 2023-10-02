import { getYear, parseISO } from 'date-fns';
import { Standing, Tournament } from '../../types/tournament';
import { Player } from './fetch/fetchLiveResults';
import { AgeDivision } from '../../types/age-division';

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
    .replace('Regional Championships', 'Regionals')
    .replace('Regional Championship', 'Regionals')
    .replace('North America International Championships', 'NAIC')
    .replace('Latin America International Championship', 'LAIC')
    .replace('North America International Championship', 'NAIC')
    .replace('Oceania International Championship', 'OCIC')
    .replace('Europe International Championships', 'EUIC')
    .replace('Europe International Championship', 'EUIC')
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

export const HARDCODED_TOURNAMENT_ROUNDS: Record<string, number> = {
  '0000086': 8
}

export const getTournamentRoundSchema = (tournament: Tournament, ageDivision?: AgeDivision) => {
  const numberOfPlayers = tournament.players[ageDivision ?? 'masters'];
  if (!numberOfPlayers) return undefined;

  if (Object.keys(HARDCODED_TOURNAMENT_ROUNDS).includes(tournament.id)) {
    return twoDayTournamentRoundSchemas.find((schema) => schema.rounds.dayOneSwissRounds === HARDCODED_TOURNAMENT_ROUNDS[tournament.id]);
  }

  return twoDayTournamentRoundSchemas.find(
    schema =>
      numberOfPlayers > schema.playerRange[0] &&
      numberOfPlayers < schema.playerRange[1]
  );
}

export const ifTournamentIsDayOneWorlds = (tournament: Tournament) => {
  const DAY_1_WORLDS_TOURNAMENT_IDS = ['0000023', '0000086'];

  return DAY_1_WORLDS_TOURNAMENT_IDS.includes(tournament.id);
}

export const ifPlayerDay2 = (
  player: Standing | Player,
  tournament: Tournament
) => {
  if (!tournament.players.masters || !tournament.roundNumbers.masters)
    return false;

  const roundSchema = getTournamentRoundSchema(tournament);
  const currentMatchPoints = player.record.wins * 3 + player.record.ties;

  if (ifTournamentIsDayOneWorlds(tournament) && roundSchema?.rounds) {
    const requiredMatchPointsToDayTwo = 3 * (roundSchema.rounds.dayOneSwissRounds - 2);

    if (currentMatchPoints >= requiredMatchPointsToDayTwo) return true;
  } else {
    if (currentMatchPoints >= 19) return true;
  }

  const currentRoundNumber = tournament.roundNumbers.masters;

  return (
    roundSchema &&
    currentRoundNumber > roundSchema.rounds.dayOneSwissRounds &&
    player.placing <= 32
  );
};
