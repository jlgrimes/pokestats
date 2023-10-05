import {
  DeckClassification,
  DeckTypeSchema,
} from '../src/hooks/deckArchetypes';
import { FormatSchema } from '../src/hooks/formats/formats';
import { AgeDivision } from './age-division';
import { StoredPlayerProfile } from './player';

export interface Deck {
  id: number;
  name: string;
  defined_pokemon: string[];
  supertype?: DeckTypeSchema;
  identifiable_cards?: string[];
  count?: number;
  list?: DeckList;
  listImagePath?: string;
  user_who_submitted?: string;
  verified?: boolean;
  tournament_id?: string;
  on_stream?: boolean;
  classification?: DeckClassification;
  player_name?: string | null;
  format?: FormatSchema;
  // Optional URL for sprites
  sprites?: string;
}

export interface DeckList {
  pokemon: DeckCard[];
  trainer: DeckCard[];
  energy: DeckCard[];
}

export interface PlayerRecord {
  wins: number;
  ties: number;
  losses: number;
}

export interface PlayerResistances {
  self: number;
  opp: number;
  oppopp: number;
}

export type MatchResult = 'W' | 'L' | 'T';

export interface PlayerRound {
  name: string;
  result: MatchResult;
  opponent?: FinalResultsSchema;
}

export interface DeckCard {
  name: string;
  count: number;
  number?: string;
  set?: string;
}

export interface Standing {
  name: string;
  profile?: StoredPlayerProfile;
  placing: number;
  record: PlayerRecord;
  resistances?: PlayerResistances;
  currentMatchResult?: MatchResult;
  rounds?: PlayerRound[];
  day2?: boolean;
  outOfDay2?: boolean;
  currentOpponent?: Standing;
  deck_archetype?: Deck | null;
  decklist: DeckList | null;
  drop?: number | null;
  tournament_id?: string;
  tournament?: Tournament | null;
  region?: string;
  age_division: AgeDivision;
}

export interface MatchupResult extends Standing {
  result?: string;
}

export type TournamentStatus = 'not-started' | 'running' | 'finished';

export type TopCutStatus = null | 'finals' | 'top4' | 'top8';

export interface Tournament {
  id: string;
  name: string;
  date: {
    start: string;
    end: string;
  };
  tournamentStatus: TournamentStatus;
  topCutStatus?: TopCutStatus;
  hasStaleData?: boolean;
  players: {
    juniors: number | null;
    seniors: number | null;
    masters: number | null;
  };
  roundNumbers: {
    juniors: number | null;
    seniors: number | null;
    masters: number | null;
  };
  lastUpdated?: string | null;
  rk9link: string;
  subStatus: 'after-day-one' | 'lunch-time' | null;
  winners?: {
    juniors: number | null;
    seniors: number | null;
    masters: number | null;
  };
  format: FormatSchema;
  should_reveal_decks: {
    juniors: boolean;
    seniors: boolean;
    masters: boolean;
  } | null;
}
