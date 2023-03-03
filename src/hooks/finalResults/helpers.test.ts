import { FinalResultsSchema } from '../../../types/final-results';
import { Deck } from '../../../types/tournament';
import {
  addUserReportedDecksToFinalResults,
  mapFinalResultsToStandings,
} from './helpers';

describe('final results helpers', () => {
  describe('addUserReportedDecksToFinalResults', () => {
    it('should correctly map user reported decks', () => {
      const mockFinalResultsData: FinalResultsSchema[] = [
        {
          name: 'Jared',
          placing: 1,
          record: { wins: 5, losses: 0, ties: 0 },
          resistances: { self: 100, opp: 100, oppopp: 100 },
          rounds: [],
          tournament_id: '1',
          deck_list: null,
          deck_archetype: null,
        },
        {
          name: 'Jared',
          placing: 1,
          record: { wins: 5, losses: 0, ties: 0 },
          resistances: { self: 100, opp: 100, oppopp: 100 },
          rounds: [],
          tournament_id: '2',
          deck_list: null,
          deck_archetype: null,
        },
      ];

      const mockUserReportedDecks: Deck[] = [
        {
          id: 1,
          defined_pokemon: ['Lugia'],
          name: 'Jared',
          player_name: 'Jared',
          tournament_id: '1',
        },
        {
          id: 2,
          defined_pokemon: ['Kyogre'],
          name: 'Jared',
          player_name: 'Jared',
          tournament_id: '2',
        },
      ];

      const modifiedFinalResults = addUserReportedDecksToFinalResults(
        mapFinalResultsToStandings(mockFinalResultsData),
        mockUserReportedDecks
      );
      expect(modifiedFinalResults).toEqual([
        {
          deck: {
            defined_pokemon: ['Lugia'],
            id: 1,
            name: 'Jared',
            player_name: 'Jared',
            tournament_id: '1',
          },
          name: 'Jared',
          placing: 1,
          record: { losses: 0, ties: 0, wins: 5 },
          resistances: { opp: 100, oppopp: 100, self: 100 },
          tournamentId: '1',
        },
        {
          deck: {
            defined_pokemon: ['Kyogre'],
            id: 2,
            name: 'Jared',
            player_name: 'Jared',
            tournament_id: '2',
          },
          name: 'Jared',
          placing: 1,
          record: { losses: 0, ties: 0, wins: 5 },
          resistances: { opp: 100, oppopp: 100, self: 100 },
          tournamentId: '2',
        },
      ]);
    });
  });
});

export {};
