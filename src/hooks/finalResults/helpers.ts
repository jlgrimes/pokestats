import { FinalResultsDeckSchema } from "./final-results-schema";

export const getDeckCounts = (
  decks: FinalResultsDeckSchema[],
  shouldDrillDown?: boolean
) =>
  decks?.reduce((acc: Record<string, number>, curr) => {
    if (!shouldDrillDown && curr.deck_supertype) {
      if (acc[`supertype${curr.deck_supertype}`]) {
        return {
          ...acc,
          [`supertype${curr.deck_supertype}`]:
            acc[`supertype${curr.deck_supertype}`] + 1,
        };
      }

      return {
        ...acc,
        [`supertype${curr.deck_supertype}`]: 1,
      };
    }

    if (acc[`archetype${curr.deck_archetype}`]) {
      return {
        ...acc,
        [`archetype${curr.deck_archetype}`]:
          acc[`archetype${curr.deck_archetype}`] + 1,
      };
    }

    return {
      ...acc,
      [`archetype${curr.deck_archetype}`]: 1,
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
