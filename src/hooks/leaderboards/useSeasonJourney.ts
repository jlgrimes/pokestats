import { isAfter, isBefore, isWithinInterval, parseISO } from "date-fns";
import { CombinedPlayerProfile } from "../../../types/player";
import { useFinalResults } from "../finalResults";
import { useTournaments } from "../tournaments";

export const useSeasonJourney = (user: CombinedPlayerProfile, worldsSeasonYear: number) => {
  const { data: tournamentPerformance, ...rest } = useFinalResults({
    playerName: user?.name,
    additionalNames: user?.additional_names,
  });
  const { data: tournaments } = useTournaments();

  const relevantStandings = tournamentPerformance?.filter((standing) => {
    const tournamentDate = tournaments?.find((tournament) => tournament.id === standing.tournamentId)?.date;
    if (tournamentDate && isAfter(parseISO(tournamentDate?.start), parseISO(`${worldsSeasonYear - 1}-09-01`)) && isBefore(parseISO(tournamentDate?.end), parseISO(`${worldsSeasonYear}-06-20`))) {
      return true;
    }
    return false;
  });

  return {
    data: relevantStandings,
    ...rest
  }
}