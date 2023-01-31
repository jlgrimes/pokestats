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
  deck_list: DeckList;
  deck_archetype: Deck | Deck[] | null;
}
