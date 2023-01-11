import { StoredPlayerProfile } from './player';

export interface Card {
  count: number;
  name: string;
  number: string;
  set: string;
}

export interface DeckArchetype {
  id: number;
  name: string;
  defined_pokemon: string[];
  identifiable_cards?: string[];
}

export interface Deck {
  id?: number;
  name?: string;
  defined_pokemon?: string[];
  identifiable_cards?: string[];
  list?: { pokemon: Card[]; trainer: Card[]; energy: Card[] };
}

export interface Standing {
  name: string;
  profile: StoredPlayerProfile;
  placing: number;
  record: { wins: number; ties: number; losses: number };
  currentMatchResult?: 'W' | 'L' | 'T';
  rounds?: { name: string; result: string; opponent: Standing }[];
  day2: boolean;
  deck: Deck;
  drop?: number;
}

export interface MatchupResult extends Standing {
  result?: string;
}

export interface Tournament {
  id: string;
  name: string;
  date: {
    start: string;
    end: string;
  };
  tournamentStatus: 'not-started' | 'running' | 'finished';
  players: {
    juniors: string | null;
    seniors: string | null;
    masters: string | null;
  };
  roundNumbers: {
    juniors: number | null;
    seniors: number | null;
    masters: number | null;
  };
  lastUpdated: string | null;
  rk9link: string;
}
