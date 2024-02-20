import { Standing, Tournament } from './tournament';

export interface StoredPlayerProfile {
  // id stored in supabase
  id?: string;
  name: string;
  email: string;
  username: string | null;
  additional_names: string[] | null;
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
  email: string;
  username: string | null | undefined;
  image?: string | null | undefined;
  additional_names: string[] | null | undefined;
  preferred_name?: string | null | undefined;
  play_pokemon_name: string | null | undefined;
  ptcg_live_name: string | null | undefined;
}

export interface PlayerTournamentPerformance {
  tournament: Tournament;
  performance: Standing;
}
