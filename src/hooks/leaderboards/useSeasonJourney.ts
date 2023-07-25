import { isAfter, isBefore, isWithinInterval, parseISO } from "date-fns";
import { CombinedPlayerProfile } from "../../../types/player";
import { Standing, Tournament } from "../../../types/tournament";
import { filterOutBFLExtras, getPointsEarned } from "../../components/TopPlayers/helpers";
import { useFinalResults } from "../finalResults";
import { useTournaments } from "../tournaments";

export interface JourneyPoint {
  standing: Standing;
  tournament: Tournament;
  pointsEarned: number;
}

export const useSeasonJourney = (user: CombinedPlayerProfile | undefined, worldsSeasonYear: number) => {
  const { data: tournamentPerformance, ...rest } = useFinalResults({
    playerName: user?.name,
    additionalNames: user?.additional_names,
  });
  const { data: tournaments } = useTournaments();

  const relevantStandings = tournamentPerformance?.slice().reverse().reduce((acc: JourneyPoint[], standing) => {
    const tournament = tournaments?.find((tournament) => tournament.id === standing.tournamentId);
    const tournamentDate = tournament?.date;
    const isTournamentInSeason = tournamentDate && isAfter(parseISO(tournamentDate?.start), parseISO(`${worldsSeasonYear - 1}-09-01`)) && isBefore(parseISO(tournamentDate?.end), parseISO(`${worldsSeasonYear}-07-10`));
    const pointsEarned = tournament ? getPointsEarned(standing, tournament) : 0;

    if (isTournamentInSeason && pointsEarned > 0) {
      return [...acc, {
        standing,
        tournament,
        pointsEarned
      }];
    }
    return acc;
  }, []);

  const journeyWithoutExceedingBFL = relevantStandings ? filterOutBFLExtras(worldsSeasonYear, relevantStandings) : undefined;

  return {
    data: journeyWithoutExceedingBFL,
    ...rest
  }
}