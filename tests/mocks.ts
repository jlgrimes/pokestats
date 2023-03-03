import { convertToDateString } from '../src/lib/dates';
import { addDays } from 'date-fns';
import { Tournament } from '../types/tournament';

export const DARWIN_MOCK_TOURNAMENT: Tournament = {
  id: '1',
  name: 'Darwin Regional Championships',
  date: {
    start: convertToDateString(addDays(new Date(), -1)),
    end: convertToDateString(addDays(new Date(), 1)),
  },
  tournamentStatus: 'running',
  players: {
    juniors: null,
    seniors: null,
    masters: null,
  },
  roundNumbers: {
    juniors: 1,
    seniors: 1,
    masters: 1,
  },
  lastUpdated: 'now',
  rk9link: 'slug',
};
