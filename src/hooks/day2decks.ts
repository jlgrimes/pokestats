import { Deck, Standing } from '../../types/tournament';
import { useLiveTournamentResults } from './tournamentResults';

export const useDay2Decks = (
  tournamentId: string,
  options?: { includeStanding: boolean }
) => {
  const { data: liveResults, isLoading } = useLiveTournamentResults(
    tournamentId,
    { load: { allRoundData: true } }
  );

  const data: Deck[] | undefined = liveResults?.data.reduce(
    (acc: Deck[], curr: Record<string, any>) => {
      if (!curr.day2) return acc;

      if (curr.deck.name) {
        return [
          ...acc,
          {
            ...curr.deck,
            ...(options?.includeStanding ? { standing: curr } : {}),
          },
        ];
      }
      return [
        ...acc,
        {
          name: 'Unreported',
          ...curr.deck,
        },
      ];
    },
    []
  );

  return {
    data,
    isLoading,
  };
};
