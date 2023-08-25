import { Standing, Tournament } from "../../../types/tournament";
import { JourneyPoint } from "../../hooks/leaderboards/useSeasonJourney";

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
  const lowercaseName = tournamentName.toLowerCase();
  const isRegional = lowercaseName.includes('regional');
  const isSPE = lowercaseName.includes('special') || tournamentName === 'Team Island: Tournament of Champions -';
  const isOpen = lowercaseName.includes('open');

  if (isRegional || isSPE || isOpen) return 'regional';
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
};

interface BFLValue {
  regionals: number;
}

export const BFL_MAP: Record<number, BFLValue> = {
  2023: {
    regionals: 6
  },
  2024: {
    regionals: 6
  }
};

export const filterOutBFLExtras = (season: number, journey: JourneyPoint[]) => {
  if (!BFL_MAP[season]) return journey; 

  const regionalsByPerformance = journey.slice().filter((point) => getTournamentType(point.tournament.name) === 'regional').sort((a, b) => b.pointsEarned - a.pointsEarned);
  const regionalsToBeRemoved = regionalsByPerformance.slice(BFL_MAP[season].regionals).map((point) => point.tournament.id);

  if (regionalsToBeRemoved.length > 0) {
    return journey.filter((point) => !regionalsToBeRemoved.some((regionalId) => regionalId === point.tournament.id));
  }

  return journey;
}