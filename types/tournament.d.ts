import { StoredPlayerProfile } from './player';

export interface Card {
  count: number;
  name: string;
  number: string;
  set: string;
}

export interface DeckArchetype {
  name: string;
  defined_pokemon: string[];
  identifiable_cards: string[];
}

export interface Deck {
  name?: string;
  defined_pokemon?: string[];
  identifiable_cards?: string[];
  list?: { pokemon: Card[]; trainer: Card[]; energy: Card[] };
}

export interface Standing {
  name: string;
  profile: StoredPlayerProfile;
  placing: string;
  record: { wins: number; ties: number; losses: number };
  currentMatchResult?: 'W' | 'L' | 'T';
  rounds?: { name: string; result: string; opponent: Standing }[];
  day2: boolean;
  deck: Deck;
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
  roundNumbers: {
    juniors: number | null;
    seniors: number | null;
    masters: number | null;
  };
  lastUpdated: string | null;
  rk9link: string;
}
