import { BadgeProps } from '@chakra-ui/react';
import {
  differenceInDays,
  format,
  formatDistance,
  formatDistanceToNow,
  parseISO,
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
    return `Upcoming - ${formatTimeUntilTournament(tournament)}`;
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

export const formatTournamentDate = (tournament: Tournament) => {
  const startDate = parseISO(tournament.date.start);
  const endDate = parseISO(tournament.date.end);

  // I want to use ordinal numbers but these guys won't let me :(
  // https://atlassian.design/content/writing-guidelines/date-and-time-guideline
  if (startDate.getMonth() !== endDate.getMonth()) {
    return `${format(startDate, 'MMMM d')}-${format(endDate, 'MMMM d, y')}`;
  }

  return `${format(startDate, 'MMMM d')}-${format(endDate, 'd, y')}`;
};

export const formatTimeUntilTournament = (tournament: Tournament) => {
  const startDate = parseISO(tournament.date.start);
  return formatDistanceToNow(startDate);
};

export const tournamentHasArrivedButNotLive = (tournament: Tournament) => {
  const startDate = parseISO(tournament.date.start);

  return differenceInDays(startDate, new Date()) <= 0;
};
