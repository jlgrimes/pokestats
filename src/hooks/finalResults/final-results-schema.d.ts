export interface FinalResultsDeckSchema {
  deck_archetype: Deck;
  deck_supertype: Deck;
  tournament_id: string;
}

export interface FinalResultsFilters {
  tournamentId?: string;
  deckId?: number | null;
  supertypeId?: number;
  playerName?: string | null;
  additionalNames?: string[] | null;
  placing?: number;
  format?: number;
}
