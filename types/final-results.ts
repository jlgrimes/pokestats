import {
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
  drop: number | null;
  rounds: PlayerRound[];
  tournament_id: string;
  deck_list: DeckList;
  deck_archetype: number;
}
