import { Standing, Tournament } from "./tournament";

export interface StoredPlayerProfile {
  // id stored in supabase
  id: string;
  name: string;
  email: string;
  tournament_history: string[]
}

export interface GooglePlayerProfile {
  name: string;
  email: string;
  description: string;
  image: string;
}

export interface CombinedPlayerProfile {
  id: string;
  name: string;
  tournamentHistory: string[],
  email: string;
  image: string;
};

export interface PlayerTournamentPerformance {
  tournament: Tournament;
  performance: Standing;
}