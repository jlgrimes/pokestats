import { useLiveTournamentResults } from './tournamentResults';

export const useDay2Decks = (tournamentId: string) => {
  const { data: liveResults, isLoading } =
    useLiveTournamentResults(tournamentId);

  const data = liveResults?.data.reduce((acc: Record<string, any>[], curr: Record<string, any>) => {
    if (curr.deck.list) {
      return [...acc, curr.deck];
    }
    return acc;
  }, []);

  return {
    data,
    isLoading,
  };
};
