import { FinalResultsSchema } from '../../../types/final-results';
import { Deck, Standing } from '../../../types/tournament';
import { FinalResultsDeckSchema } from './final-results-schema';

export const getDeckCounts = (
  decks: FinalResultsDeckSchema[],
  shouldDrillDown?: boolean
) =>
  decks?.reduce((acc: Record<string, number>, curr) => {
    if (!curr.deck_supertype?.id && !curr.deck_archetype?.id) {
      if (acc.unreported) {
        return {
          ...acc,
          unreported: acc.unreported + 1,
        };
      } else {
        return {
          ...acc,
          unreported: 1,
        };
      }
    }

    if (!shouldDrillDown && curr.deck_supertype?.id) {
      if (acc[`supertype${curr.deck_supertype.id}`]) {
        return {
          ...acc,
          [`supertype${curr.deck_supertype.id}`]:
            acc[`supertype${curr.deck_supertype.id}`] + 1,
        };
      }

      return {
        ...acc,
        [`supertype${curr.deck_supertype.id}`]: 1,
      };
    }

    if (acc[`archetype${curr.deck_archetype?.id}`]) {
      return {
        ...acc,
        [`archetype${curr.deck_archetype.id}`]:
          acc[`archetype${curr.deck_archetype.id}`] + 1,
      };
    }

    return {
      ...acc,
      [`archetype${curr.deck_archetype.id}`]: 1,
    };
  }, {});

export const filterFinalResultsByTournament = (
  finalResults: {
    tournament_id: string;
    deck_archetype: number;
    deck_supertype: number;
  }[],
  tournamentRange: number[]
) => {
  const lowerBound = tournamentRange[0];
  const upperBound = tournamentRange.length > 0 ? tournamentRange[1] : null;

  return finalResults?.filter(({ tournament_id }) => {
    if (parseInt(tournament_id) < lowerBound) {
      return false;
    }

    if (upperBound && parseInt(tournament_id) > upperBound) {
      return false;
    }

    return true;
  });
};