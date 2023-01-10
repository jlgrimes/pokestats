import { BadgeProps } from '@chakra-ui/react';
import { Tournament } from '../../../types/tournament';

export const getStandingsBadgeProps = (tournament: Tournament): BadgeProps => {
  if (tournament.tournamentStatus === 'finished') {
    return {
      children: 'Final',
    };
  }

  if (tournament.tournamentStatus === 'running') {
    return {
      children: `Live - Round ${tournament.roundNumbers.masters}`,
      colorScheme: 'green',
      variant: 'solid',
    };
  }

  return {};
};

export const getRK9TournamentUrl = (slug: string) =>
  `https://rk9.gg/tournament/${slug}`;
