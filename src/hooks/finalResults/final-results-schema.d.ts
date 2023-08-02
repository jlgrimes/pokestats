export interface FinalResultsDeckSchema {
  deck_archetype: Deck;
  deck_supertype: Deck;
  tournament_id: string;
  day2?: boolean;
}

export interface FinalResultsFilters {
  tournamentId?: string;
  deckId?: number | null;
  supertypeId?: number;
  playerName?: string | null;
  additionalNames?: string[] | null;
  placing?: number;
  format?: number;
  shouldExpandTournament?: boolean;
  minimumPlacing?: number;
  playerNames?: string[];
  shouldLoadOpponentRounds?: boolean;
}
