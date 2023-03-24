import { Standing } from '../../../types/tournament';

const FAKE_PLAYER: Standing = {
  name: 'Jared Grimes',
  placing: 1,
  deck: {
    id: 2,
    name: 'Lost Box Kyogre',
    defined_pokemon: ['Comfey', 'Kyogre'],
  },
  record: {
    wins: 5,
    ties: 0,
    losses: 4,
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
      },
    },
  ],
};

const MOCK_MAHONE: Standing = {
  name: 'Andrew Mahone',
  placing: 99,
  deck: {
    id: 2,
    name: 'Regigigas',
    defined_pokemon: ['Regigigas'],
  },
  record: {
    wins: 0,
    ties: 0,
    losses: 8,
  },
  rounds: [
    {
      name: 'Andrew Mahone',
      result: 'L',
      opponent: {
        name: 'Noah Spinale',
        placing: 999,
        record: {
          wins: 0,
          ties: 0,
          losses: 4,
        },
      },
    },
  ],
};

export const usePlayerLiveResults = (tournamentId: string, name: string) => {
  if (name === 'Andrew Mahone') {
    return {
      player: MOCK_MAHONE,
    };
  }

  return {
    player: FAKE_PLAYER,
  };
};

export const useLiveTournamentResults = (tournamentId: string) => {
  if (tournamentId === '1') {
    const fakeStandings: Standing[] = [FAKE_PLAYER, MOCK_MAHONE];

    return {
      data: { data: fakeStandings },
      isLoading: false,
      shouldHideDecks: false,
    };
  }

  return { data: [], isLoading: false, shouldHideDecks: false };
};
