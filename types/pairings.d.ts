import { PlayerRecord } from "./tournament";

export interface PairingPlayer {
  name: string;
  record: PlayerRecord;
  result: string;
}

export interface Pairing {
  table: number;
  players: PairingPlayer[];
}

export interface PairingSubmission {
  id: number;
  deck_archetype: number;
  player1_name: string;
  player2_name: string;
  user_who_submitted: string;
  table_number: number;
  round_number: number;
}

export interface FetchPairingsOptions {
  prefetch?: boolean;
  roundNumber?: number;
}

export interface PairingsSchema {
  tables: Pairing[];
}

export interface FetchPairingsSchema {
  round: number;
  tables?: Pairing[];
  maxRound: number;
}