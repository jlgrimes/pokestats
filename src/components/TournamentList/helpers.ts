import { BadgeProps } from '@chakra-ui/react';
import { CalloutProps } from '@tremor/react';
import {
  differenceInDays,
  format,
  parseISO,
  eachWeekendOfInterval,
  isWithinInterval,
  endOfDay,
  formatDistanceToNowStrict,
  isThisYear,
} from 'date-fns';
import { Tournament } from '../../../types/tournament';
import { TournamentOrSet } from '../../hooks/sets';
import { getRoundText } from '../Tournament/helpers';
import {
  getRawTimeUntilTournament,
  getTimeUntilTournament,
} from '../Tournament/Home/helpers';

export const formatTournamentStatus = (
  tournament: Tournament,
  utcOffset?: number
) => {
  if (tournament.subStatus === 'after-day-one') {
    return 'End of day one';
  }

  if (tournament.tournamentStatus === 'finished') {
    return 'Completed';
  }

  if (tournament.tournamentStatus === 'running') {
    return `Live - ${getRoundText(tournament)}`;
  }

  if (tournament.tournamentStatus === 'not-started') {
    if (
      utcOffset
        && getRawTimeUntilTournament(tournament, utcOffset) < 0
    ) {
      return `About to Start`;
    }
    return `Live in ${getTimeUntilTournament(tournament, utcOffset)}`;
  }

  return '';
};

export const getTournamentStatusBadgeProps = (
  tournament: Tournament
): BadgeProps => {
  if (tournament.subStatus === 'after-day-one') {
    return {
      variant: 'solid',
      colorScheme: 'green',
      opacity: 0.6,
    };
  }

  if (tournament.tournamentStatus === 'running') {
    return {
      variant: 'solid',
      colorScheme: 'green',
    };
  }

  if (tournament.tournamentStatus === 'not-started') {
    return {
      variant: 'solid',
      colorScheme: 'purple',
    };
  }

  if (tournament.tournamentStatus === 'finished') {
    return {
      variant: 'solid',
      colorScheme: 'blackAlpha',
    };
  }

  return {};
};

export const getTournamentStatusCalloutProps = (
  tournament: Tournament
): Partial<CalloutProps> => {
  if (tournament.subStatus === 'after-day-one') {
    return {
      color: 'teal'
    };
  }

  if (tournament.tournamentStatus === 'running') {
    return {
      color: 'blue'
    };
  }

  if (tournament.tournamentStatus === 'not-started') {
    return {
      color: 'violet'
    };
  }

  if (tournament.tournamentStatus === 'finished') {
    return {
      color: 'slate'
    };
  }

  return {};
};

export const getTournamentRange = (tournament: Tournament) => {
  const startDate = parseISO(tournament.date.start);
  const endDate = parseISO(tournament.date.end);

  try {
    if (tournament.name.includes('Regional')) {
      return eachWeekendOfInterval({
        start: startDate,
        end: endDate,
      });
    }
  } catch(e) {
    // If the weekend thing doesn't work, just return whatever is in there.
    return [startDate, endDate];
  }

  return [startDate, endDate];
};

export const formatTournamentDate = (
  tournament: Tournament,
  verbose?: boolean
) => {
  const [startDate, endDate] = getTournamentRange(tournament);

  // I want to use ordinal numbers but these guys won't let me :(
  // https://atlassian.design/content/writing-guidelines/date-and-time-guideline
  return `${format(startDate, 'MMMM d')}${startDate.getMonth() !== endDate.getMonth() ? ' - ' : '-'}${format(
    endDate,
    `${startDate.getMonth() !== endDate.getMonth() ? 'MMMM ' : ''}d${', y'}`
  )}`;
};

export const formatTimeUntilTournament = (tournament: Tournament) => {
  const [startDate] = getTournamentRange(tournament);
  return formatDistanceToNowStrict(startDate);
};

export const tournamentHasArrivedButNotLive = (tournament: Tournament) => {
  const [startDate] = getTournamentRange(tournament);

  return (
    tournament.tournamentStatus === 'not-started' &&
    differenceInDays(startDate, new Date()) < 7
  );
};

export const tournamentFallsOnCurrentDate = (tournament: Tournament) => {
  const [startDate, endDate] = getTournamentRange(tournament);
  return isWithinInterval(new Date(), {
    start: startDate,
    end: endOfDay(endDate),
  });
};