import { BadgeProps } from '@chakra-ui/react';
import {
  differenceInDays,
  format,
  parseISO,
  eachWeekendOfInterval,
  isWithinInterval,
  endOfDay,
  formatDistanceToNowStrict,
} from 'date-fns';
import { Tournament } from '../../../types/tournament';
import { TournamentOrSet } from '../../hooks/sets';
import { getRoundText } from '../Tournament/helpers';

export const formatTournamentStatus = (tournament: Tournament) => {
  if (tournament.tournamentStatus === 'finished') {
    return 'Completed';
  }

  if (tournament.tournamentStatus === 'running') {
    return `Live - ${getRoundText(tournament)}`;
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
  return formatDistanceToNowStrict(startDate);
};

export const tournamentHasArrivedButNotLive = (tournament: Tournament) => {
  const [startDate] = getTournamentRange(tournament);

  return (
    tournament.tournamentStatus !== 'finished' &&
    differenceInDays(startDate, new Date()) <= 0
  );
};

export const tournamentFallsOnCurrentDate = (tournament: Tournament) => {
  const [startDate, endDate] = getTournamentRange(tournament);
  return isWithinInterval(new Date(), {
    start: startDate,
    end: endOfDay(endDate),
  });
};

export const getMostRecentTournaments = (items: TournamentOrSet[]) => {
  const finishedTournaments = items.filter(
    tournament => tournament.data.tournamentStatus === 'finished'
  );
  const almostStartedTournamentFilter = (tournament: TournamentOrSet) =>
    tournament.data.date &&
    tournamentHasArrivedButNotLive(tournament.data as unknown as Tournament);

  const upcomingTournaments = items.filter(tournament => {
    return (
      tournament.data.tournamentStatus === 'not-started' &&
      differenceInDays(parseISO(tournament.data.date?.start), new Date()) <=
        7 &&
      !almostStartedTournamentFilter(tournament)
    );
  });

  const liveTournaments = items.filter(
    tournament => tournament.data.tournamentStatus === 'running'
  );
  const almostStartedTournaments = items.filter(tournament =>
    almostStartedTournamentFilter(tournament)
  );

  return {
    highlightedTournamentsLength:
      liveTournaments.length + almostStartedTournaments.length,
    items: [
      ...liveTournaments,
      ...almostStartedTournaments,
      ...finishedTournaments.slice(0, 2),
      ...upcomingTournaments,
    ],
  };
};
