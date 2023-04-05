import { FinalResultsSchema } from '../../../types/final-results';
import { Deck, Standing } from '../../../types/tournament';
import { FinalResultsDeckSchema } from './final-results-schema';

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

export const mapFinalResultsToStandings = (
  finalResultsData: FinalResultsSchema[]
) =>
  finalResultsData.map((finalResult: FinalResultsSchema) => ({
    deck: finalResult.deck_archetype
      ? {
          ...finalResult.deck_archetype,
          ...(finalResult.deck_list
            ? {
                list: finalResult.deck_list,
              }
            : finalResult.uploaded_list_path
            ? {
                listImagePath: finalResult.uploaded_list_path,
              }
            : {}),
        }
      : null,
    name: finalResult.name,
    placing: finalResult.placing,
    record: finalResult.record,
    rounds: finalResult.rounds,
    resistances: finalResult.resistances,
    tournamentId: finalResult.tournament_id,
  }));

export const addUserReportedDecksToFinalResults = (
  finalResultsAsStandings: Standing[],
  userReportedDecks: Deck[]
) => {
  return finalResultsAsStandings?.map(finalResult => {
    const userReportedDeck = userReportedDecks?.find(
      deck =>
        finalResult.name === deck.player_name &&
        finalResult.tournamentId === deck.tournament_id
    );

    if (!userReportedDeck || finalResult.deck?.list) return finalResult;

    return {
      ...finalResult,
      deck: { ...finalResult.deck, ...userReportedDeck },
    };
  });
};
