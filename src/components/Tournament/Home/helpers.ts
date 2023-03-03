import { addMinutes, format, formatDistanceStrict, getTime } from 'date-fns';
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

  if (now.getDay() !== offsetTimezone(now, utcOffsetMinutes).getDay()) {
    return format(offsetTimezone(now, utcOffsetMinutes), 'eee LLL d K:mm aaa');
  }

  return format(offsetTimezone(now, utcOffsetMinutes), 'K:mm aaa');
};

export const getLocalizedTournamentTime = (
  tournament: Tournament,
  utcOffsetMinutes: number
) => {
  const [startDate] = getTournamentRange(tournament);
  let tournamentStartTime = new Date(
    Date.UTC(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      9 - utcOffsetMinutes / 60,
      0,
      0
    )
  );

  return tournamentStartTime;
};

export const getRawTimeUntilTournament = (
  tournament: Tournament,
  utcOffsetMinutes: number
) =>
  getTime(getLocalizedTournamentTime(tournament, utcOffsetMinutes)) -
  getTime(new Date());

export const getTimeUntilTournament = (
  tournament: Tournament,
  utcOffsetMinutes?: number
) => {
  if (!utcOffsetMinutes) {
    return formatTimeUntilTournament(tournament);
  }

  const tournamentStartTime = getLocalizedTournamentTime(
    tournament,
    utcOffsetMinutes
  );

  // Ceil is fine closer to the tournament, because we don't usually start right at 9 AM.
  // For dates, two nights before would still be "two days" instead of "one day" rounded.
  return formatDistanceStrict(tournamentStartTime, new Date(), {
    roundingMethod: 'ceil',
  });
};
