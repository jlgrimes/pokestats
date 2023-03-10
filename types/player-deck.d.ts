export interface PlayerDeck {
  player_name: string;
  deck_archetype: number;
  tournament_id: string;
  user_who_submitted: string;
  user_submitted_was_admin: boolean;
  on_stream: boolean;
}
