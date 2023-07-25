import { Standing, Tournament } from "../../../types/tournament";

export type TournamentType = 'regional' | 'ic';

interface PointMapValue {
  points: number;
  // The number of players needed for points to apply
  kicker?: number;
}

export const REGIONAL_POINT_MAP: Record<number, PointMapValue> = {
  1: {
    points: 200
  },
  2: {
    points: 160
  },
  4: {
    points: 130
  },
  8: {
    points: 100
  },
  16: {
    points: 80,
    kicker: 48
  },
  32: {
    points: 60,
    kicker: 100
  },
  64: {
    points: 50,
    kicker: 200
  },
  128: {
    points: 40,
    kicker: 400
  },
  256: {
    points: 30,
    kicker: 800
  },
};

export const IC_POINT_MAP: Record<number, PointMapValue> = {
  1: {
    points: 500
  },
  2: {
    points: 400
  },
  4: {
    points: 320
  },
  8: {
    points: 250
  },
  16: {
    points: 200,
    kicker: 48
  },
  32: {
    points: 160,
    kicker: 100
  },
  64: {
    points: 130,
    kicker: 200
  },
  128: {
    points: 100,
    kicker: 400
  },
  256: {
    points: 80,
    kicker: 800
  },
  512: {
    points: 60,
    kicker: 1600
  },
};

export const getTournamentType = (tournamentName: string): TournamentType | undefined => {
  if (tournamentName.toLowerCase().includes('regional')) return 'regional';
  if (tournamentName.toLowerCase().includes('international') || tournamentName.includes('intercontinental')) return 'ic';
};

export const getPointsEarned = (standing: Standing, tournament: Tournament): number => {
  const tournamentType = getTournamentType(tournament.name);
  if (!tournamentType || !tournament.players.masters) return 0;

  const tournamentMap = tournamentType === 'ic' ? IC_POINT_MAP : REGIONAL_POINT_MAP;
  const placement = standing.placing;

  for (const key of Object.keys(tournamentMap)) {
    const keyNum = parseInt(key);

    if (placement <= keyNum) {
      const pointsEntry = tournamentMap[keyNum];

      // If there's a kicker but the tournament didn't hit it, no points
      if (pointsEntry.kicker && (tournament.players.masters < pointsEntry.kicker)) {
        return 0;
      }

      return pointsEntry.points;
    }
  }

  return 0;
}