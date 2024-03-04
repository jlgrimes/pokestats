import { parseGameLog } from "./helpers";

jest.mock("../../lib/supabase/client", () => ({
  from: jest.fn()
}));

describe('PracticeLogger helpers', () => {
  describe('when parseGameLog is called', () => {
    it('should replace all instances of player with "You"', () => {
      const parsedLog = parseGameLog('test-user drew for turn. test-user\'s Chien-Pao used Hail Blade.', 'test-user');
      expect(parsedLog).toEqual([{
        message: 'You drew for turn. your Chien-Pao used Hail Blade.',
        type: 'action'
      }])
    });

    it('should replace all instances of case-insensitive player with "You"', () => {
      const parsedLog = parseGameLog('test-USER drew for turn. test-User\'s Chien-Pao used Hail Blade.', 'test-user');
      expect(parsedLog).toEqual([{
        message: 'You drew for turn. your Chien-Pao used Hail Blade.',
        type: 'action'
      }])
    });

    it('should correctly say "You win" when you won the game', () => {
      const parsedLog = parseGameLog('test-USER drew for turn. test-User wins.', 'test-user');
      expect(parsedLog).toEqual([{
        message: 'You drew for turn. You win.',
        type: 'action'
      }])
    });
  });
})