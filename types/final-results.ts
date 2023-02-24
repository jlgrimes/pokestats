import {
  Deck,
  DeckList,
  PlayerRecord,
  PlayerResistances,
  PlayerRound,
} from './tournament';

export interface FinalResultsSchema {
  name: string;
  placing: number;
  record: PlayerRecord;
  resistances: PlayerResistances;
  rounds: PlayerRound[];
  tournament_id: string;
  deck_list: DeckList | null;
  deck_archetype: Deck | null;
}
