import { addMinutes, format, formatDistanceStrict } from 'date-fns';
import { Tournament } from '../../../../types/tournament';
import {
  formatTimeUntilTournament,
  getTournamentRange,
} from '../../TournamentList/helpers';

export const getLocalTime = (utcOffsetMinutes: number) => {
  const now = new Date();
  const currentOffset = now.getTimezoneOffset();

  const timeZoneDate = addMinutes(now, currentOffset + utcOffsetMinutes);
  return format(timeZoneDate, 'eee LLL d K:mm aaa');
};

export const getTimeUntilTournament = (
  tournament: Tournament,
  utcOffsetMinutes?: number
) => {
  if (!utcOffsetMinutes) {
    return formatTimeUntilTournament(tournament);
  }

  const [startDate] = getTournamentRange(tournament);
  const tournamentStartTime = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
    9,
    0,
    0
  );

  return formatDistanceStrict(tournamentStartTime, new Date());
};
