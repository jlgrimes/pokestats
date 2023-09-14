import { isAfter, isBefore, isWithinInterval, parseISO } from "date-fns";
import { CombinedPlayerProfile } from "../../../types/player";
import { Standing, Tournament } from "../../../types/tournament";
import { seasonToReadableYear } from "../../components/Home/LeaderboardCard";
import { filterOutBFLExtras, getPointsEarned } from "../../components/TopPlayers/helpers";
import { useFinalResults } from "../finalResults";

export interface JourneyPoint {
  standing: Standing;
  tournament: Tournament;
  pointsEarned: number;
}

export const useSeasonJourney = (user: CombinedPlayerProfile | undefined, season: number) => {
  const worldsSeasonYear = seasonToReadableYear(season);

  const { data: tournamentPerformance, ...rest } = useFinalResults({
    playerName: user?.name,
    additionalNames: user?.additional_names,
    shouldExpandTournament: true
  });

  const relevantStandings = tournamentPerformance?.slice().reverse().reduce((acc: JourneyPoint[], standing) => {
    const tournament = standing.tournament;
    const tournamentDate = tournament?.date;
    const isTournamentInSeason = tournamentDate && isAfter(parseISO(tournamentDate?.start), parseISO(`${worldsSeasonYear - 1}-08-01`)) && isBefore(parseISO(tournamentDate?.end), parseISO(`${worldsSeasonYear}-07-10`));
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
    ...rest,
  }
}