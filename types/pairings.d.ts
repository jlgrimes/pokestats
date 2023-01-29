export interface Pairing {
  table: number;
  players: string[];
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
