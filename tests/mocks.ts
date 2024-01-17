import { convertToDateString } from '../src/lib/dates';
import { addDays } from 'date-fns';
import { Tournament, TournamentStatus } from '../types/tournament';

export const DARWIN_MOCK_TOURNAMENT: Tournament = {
  id: '1',
  name: 'Darwin Regional Championships',
  date: {
    start: '2023-03-04',
    end: '2023-03-05',
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
  subStatus: null,
  format: {
    id: 2,
    format: 'standard',
    rotation: '',
    start_date: '',
  },
  should_reveal_decks: {
    juniors: false,
    seniors: false,
    masters: false,
  },
  metadata: {}
};

export const SYDNEY_MOCK_TOURNAMENT = {
  id: '2',
  name: 'Sydney Regional Championships',
  date: {
    start: '2023-02-04',
    end: '2023-02-05',
  },
  tournamentStatus: 'finished' as TournamentStatus,
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
  subStatus: null,
  format: {
    id: 2,
    format: 'standard',
    rotation: '',
    start_date: '',
  },
  should_reveal_decks: {
    juniors: true,
    seniors: true,
    masters: true,
  },
  metadata: {}
};
