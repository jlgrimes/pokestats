import { addMinutes, format, formatDistanceStrict } from 'date-fns';
import { Tournament } from '../../../../types/tournament';
import {
  formatTimeUntilTournament,
  getTournamentRange,
} from '../../TournamentList/helpers';

const offsetTimezone = (date: Date, utcOffsetMinutes: number) => {
  const currentOffset = date.getTimezoneOffset();

  return addMinutes(date, currentOffset + utcOffsetMinutes);
};

export const isInSameTimeZone = (utcOffsetMinutes: number) => {
  const now = new Date();
  return now.getTimezoneOffset() === utcOffsetMinutes * -1;
};

export const getLocalTime = (utcOffsetMinutes: number) => {
  const now = new Date();
  return format(offsetTimezone(now, utcOffsetMinutes), 'eee LLL d K:mm aaa');
};

export const getTimeUntilTournament = (
  tournament: Tournament,
  utcOffsetMinutes?: number
) => {
  if (!utcOffsetMinutes) {
    return formatTimeUntilTournament(tournament);
  }

  const [startDate] = getTournamentRange(tournament);
  let tournamentStartTime = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
    9,
    0,
    0
  );
  tournamentStartTime = offsetTimezone(tournamentStartTime, utcOffsetMinutes);

  return formatDistanceStrict(tournamentStartTime, new Date());
};
