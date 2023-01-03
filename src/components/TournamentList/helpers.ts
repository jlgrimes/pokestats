import { BadgeProps } from '@chakra-ui/react';
import { Tournament } from '../../../types/tournament';

export const formatTournamentStatus = (tournament: Tournament) => {
  if (tournament.tournamentStatus === 'finished') {
    return 'Completed';
  }

  if (tournament.tournamentStatus === 'running') {
    return `Live - Round ${tournament.roundNumbers.masters}`;
  }

  if (tournament.tournamentStatus === 'not-started') {
    return 'Upcoming';
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
  const startDate = new Date(tournament.date.start);
  const endDate = new Date(tournament.date.end);

  return `${startDate.toDateString()} - ${endDate.toDateString()}`;
};
