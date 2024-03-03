import { BadgeProps } from '@chakra-ui/react';
import { Tournament } from '../../../types/tournament';
import { getTournamentRoundSchema } from '../../lib/tournament';

export const getRoundText = (tournament: Tournament) => {
  if (tournament.topCutStatus === 'top8') return 'Top 8';
  if (tournament.topCutStatus === 'top4') return 'Top 4';
  if (tournament.topCutStatus === 'finals') return 'Finals';

  // The main display is always going to prioritize Masters
  const tournamentSchema = getTournamentRoundSchema(tournament, 'masters');

  if (tournamentSchema) {
    const swissRounds = tournamentSchema.rounds.dayOneSwissRounds + tournamentSchema.rounds.dayTwoSwissRounds;
    const roundNumber = tournament.roundNumbers.masters;
  
    if (roundNumber === swissRounds + 1) {
      return 'Top 8';
    }
  
    if (roundNumber === swissRounds + 2) {
      return 'Top 4';
    }

    if (roundNumber === swissRounds + 3) {
      return 'Finals';
    }
  }

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
