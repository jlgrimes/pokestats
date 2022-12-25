import { Standing, Tournament } from "./tournament";

export interface StoredPlayerProfile {
  // id stored in supabase
  id: string;
  name: string;
  twitterHandle: string;
  tournamentHistory: string[]
}

export interface TwitterPlayerProfile {
  // Twitter id
  id: string;
  name: string;
  username: string;
  description: string;
  profile_image_url: string;
}

export interface CombinedPlayerProfile {
  id: string;
  name: string;
  tournamentHistory: string[],
  username: string;
  description: string;
  profile_image_url: string;
};

export interface PlayerTournamentPerformance {
  tournament: Tournament;
  performance: Standing;
}