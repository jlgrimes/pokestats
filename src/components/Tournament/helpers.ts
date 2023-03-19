import { BadgeProps } from '@chakra-ui/react';
import { Tournament } from '../../../types/tournament';

export const getRoundText = (tournament: Tournament) => {
  if (tournament.topCutStatus === 'top8') return 'Top Eight';
  if (tournament.topCutStatus === 'top4') return 'Top Four';
  if (tournament.topCutStatus === 'finals') return 'Finals';

  return `Round ${tournament.roundNumbers.masters ?? ''}`;
};

export const getStandingsBadgeProps = (tournament: Tournament): BadgeProps => {
  if (tournament.tournamentStatus === 'finished') {
    return {
      children: 'Final',
    };
  }

  if (tournament.tournamentStatus === 'running') {
    return {
      children: `Live - ${getRoundText(tournament)}`,
      colorScheme: 'green',
      variant: 'solid',
    };
  }

  return {};
};

export const getRK9TournamentUrl = (
  slug: string,
  directory: string = 'tournament'
) => `https://rk9.gg/${directory}/${slug}`;
