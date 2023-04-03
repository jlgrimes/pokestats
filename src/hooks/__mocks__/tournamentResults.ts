import { Standing } from '../../../types/tournament';

const MOCK_NOAH: Standing = {
  name: 'Noah Spinale',
  placing: 98,
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
      name: 'Jared',
      result: 'L',
      opponent: {
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
      },
    },
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
      opponent: MOCK_NOAH,
    },
    {
      name: 'Jared Grimes',
      result: 'W',
      opponent: {
        name: 'Azul GG',
        placing: 999,
        record: {
          wins: 1,
          ties: 0,
          losses: 8,
        },
      }
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
      opponent: MOCK_NOAH,
    },
    {
      name: 'Azul GG',
      result: 'L',
      opponent: {
        name: 'Azul GG',
        placing: 999,
        record: {
          wins: 1,
          ties: 0,
          losses: 8,
        },
        deck: {
          id: 2,
          name: 'Regigigas',
          defined_pokemon: ['Regigigas'],
        },
      },
    },
  ],
};

export const usePlayerLiveResults = (tournamentId: string, name: string) => {
  if (name === 'Andrew Mahone') {
    return {
      player: MOCK_MAHONE,
      shouldHideDecks: true,
    };
  }

  if (name === 'Noah Spinale') {
    return {
      player: MOCK_NOAH,
      shouldHideDecks: true,
    };
  }

  return {
    player: FAKE_PLAYER,
    shouldHideDecks: true,
  };
};

export const useLiveTournamentResults = (tournamentId: string) => {
  if (tournamentId === '1') {
    const fakeStandings: Standing[] = [FAKE_PLAYER, MOCK_MAHONE, MOCK_NOAH];

    return {
      data: { data: fakeStandings },
      isLoading: false,
      shouldHideDecks: true,
    };
  }

  return { data: [], isLoading: false, shouldHideDecks: false };
};
