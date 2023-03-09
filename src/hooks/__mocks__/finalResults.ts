import { FinalResultsFilters } from '../finalResults/final-results-schema';

export const useChampions = () => ({
  data: {
    '2': {
      name: 'Noah Conway',
      placing: 1,
      record: {
        wins: 15,
        ties: 3,
        losses: 0,
      },
      resistances: {},
      rounds: [],
      tournament_id: '2',
      deck_list: {},
      deck_archetype: {
        id: 1,
        name: 'Torterra',
        defined_pokemon: ['Torterra'],
      },
    },
  },
});

export const useFinalResults = (filters?: FinalResultsFilters) => {
  if (filters?.playerName === 'Jared Grimes') {
    return {
      data: [
        {
          tournamentId: '2',
        },
      ],
    };
  }

  return {
    data: [],
  };
};
