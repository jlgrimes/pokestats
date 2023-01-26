export interface Pairing {
  table: number;
  players: string[];
}

export interface PairingRound {
  round: number;
  tables: Pairing[];
}
