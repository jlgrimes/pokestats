import {
  Deck,
  DeckList,
  PlayerRecord,
  PlayerResistances,
  PlayerRound,
  Tournament,
} from './tournament';

export interface FinalResultsSchema {
  name: string;
  placing: number;
  record: PlayerRecord;
  resistances: PlayerResistances;
  rounds: PlayerRound[];
  tournament_id: string;
  decklist: DeckList | null;
  deck_archetype: Deck | null;
  uploaded_list_path: string | null;
  tournament: Tournament | null;
}
