import { Standing } from '../../../types/tournament';

const FAKE_PLAYER: Standing = {
  name: 'Jared Grimes',
  placing: 1,
  record: {
    wins: 3,
    ties: 0,
    losses: 1,
  },
  rounds: [
    {
      name: 'Jared Grimes',
      result: 'W',
      opponent: {
        name: 'Noah Spinale',
        placing: 999,
        record: {
          wins: 0,
          ties: 0,
          losses: 4,
        },
      }
    },
  ],
};

export const usePlayerLiveResults = (tournamentId: string, name: string) => {
  return {
    player: FAKE_PLAYER,
  };
};

export const useLiveTournamentResults = (tournamentId: string) => {
  if (tournamentId === '1') {
    const fakeStandings: Standing[] = [FAKE_PLAYER];

    return {
      data: { data: fakeStandings },
      isLoading: false,
    };
  }

  return { data: [], isLoading: false };
};
