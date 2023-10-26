import {
  DARWIN_MOCK_TOURNAMENT,
  SYDNEY_MOCK_TOURNAMENT,
} from '../../../tests/mocks';

export const useTournaments = () => ({
  data: [DARWIN_MOCK_TOURNAMENT, SYDNEY_MOCK_TOURNAMENT],
});