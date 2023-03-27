import { Standing, Tournament } from "./tournament";

export interface StoredPlayerProfile {
  // id stored in supabase
  id?: string;
  name: string;
  email: string;
  username: string | null
}

export interface GooglePlayerProfile {
  name: string;
  email: string;
  description: string;
  image: string;
}

export interface CombinedPlayerProfile {
  id: string;
  name: string | null | undefined;
  email: string | null | undefined;
  username: string | null | undefined;
  image?: string | null | undefined;
  additional_names: string[] | null | undefined;
};

export interface PlayerTournamentPerformance {
  tournament: Tournament;
  performance: Standing;
}