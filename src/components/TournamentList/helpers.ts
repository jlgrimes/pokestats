import { BadgeProps } from '@chakra-ui/react';
import {
  differenceInDays,
  format,
  formatDistance,
  formatDistanceToNow,
  parseISO,
  eachWeekendOfInterval,
} from 'date-fns';
import { Tournament } from '../../../types/tournament';

export const formatTournamentStatus = (tournament: Tournament) => {
  if (tournament.tournamentStatus === 'finished') {
    return 'Completed';
  }

  if (tournament.tournamentStatus === 'running') {
    return `Live - Round ${tournament.roundNumbers.masters}`;
  }

  if (tournament.tournamentStatus === 'not-started') {
    if (tournamentHasArrivedButNotLive(tournament)) {
      return `About to Start`;
    }
    return `Live in ${formatTimeUntilTournament(tournament)}`;
  }
};

export const getTournamentStatusBadgeProps = (
  tournament: Tournament
): BadgeProps => {
  if (tournament.tournamentStatus === 'finished') {
    return {};
  }

  if (tournament.tournamentStatus === 'running') {
    return { colorScheme: 'green', variant: 'solid' };
  }

  if (tournament.tournamentStatus === 'not-started') {
    return { colorScheme: 'purple' };
  }

  return {};
};

const getTournamentRange = (tournament: Tournament) => {
  if (tournament.name.includes('Regional')) {
    return eachWeekendOfInterval({
      start: parseISO(tournament.date.start),
      end: parseISO(tournament.date.end),
    });
  }

  return [parseISO(tournament.date.start), parseISO(tournament.date.end)];
};

export const formatTournamentDate = (tournament: Tournament) => {
  const [startDate, endDate] = getTournamentRange(tournament);

  // I want to use ordinal numbers but these guys won't let me :(
  // https://atlassian.design/content/writing-guidelines/date-and-time-guideline
  if (startDate.getMonth() !== endDate.getMonth()) {
    return `${format(startDate, 'MMMM d')}-${format(endDate, 'MMMM d, y')}`;
  }

  return `${format(startDate, 'MMMM d')}-${format(endDate, 'd, y')}`;
};

export const formatTimeUntilTournament = (tournament: Tournament) => {
  const [startDate] = getTournamentRange(tournament);
  return formatDistanceToNow(startDate);
};

export const tournamentHasArrivedButNotLive = (tournament: Tournament) => {
  const [startDate] = getTournamentRange(tournament);

  return differenceInDays(startDate, new Date()) <= 0;
};
