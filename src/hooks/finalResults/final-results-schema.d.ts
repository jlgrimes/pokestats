export interface FinalResultsDeckSchema {
  deck_archetype: number;
  deck_supertype: number;
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
