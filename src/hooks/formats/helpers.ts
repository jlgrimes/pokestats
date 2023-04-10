import { differenceInDays, isAfter } from "date-fns";
import { Tournament } from "../../../types/tournament";
import { FormatSchema } from "./formats";

export const getTournamentFormat = (formats: FormatSchema[], tournament: Tournament) => {
  let mostRecentFormat;
  for (const format of formats) {
    if (!mostRecentFormat) {
      mostRecentFormat = format;
    } else {
      const tournamentCouldBeInFormat = !isAfter(
        new Date(format.start_date),
        new Date(tournament.date.start)
      );
      const tournamentIsCloserToDate =
        differenceInDays(
          new Date(tournament.date.start),
          new Date(format.start_date)
        ) <
        differenceInDays(
          new Date(tournament.date.start),
          new Date(mostRecentFormat.start_date)
        );

      if (tournamentCouldBeInFormat && tournamentIsCloserToDate) {
        mostRecentFormat = format;
      }
    }
  }
  return mostRecentFormat;
}