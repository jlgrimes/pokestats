import { AgeDivision } from "../../../types/age-division";
import { PlayerRecord, PlayerResistances, PlayerRound } from "../../../types/tournament";
import { cropPlayerName } from "../../lib/fetch/fetchLiveResults";
import { capitalize } from "../../lib/strings";
import supabase from "../../lib/supabase/client";

export interface VgcStanding {
  id: string;
  created_at: string;
  tournament_id: number;
  name: string;
  placing: number;
  record: PlayerRecord;
  resistances: PlayerResistances;
  drop: number;
  rounds: PlayerRound[];
  age_division: AgeDivision;
  region: string | null;
}

export const fetchVgcStandings = async (tournamentId: number, ageDivision: AgeDivision): Promise<VgcStanding[]> => {
  const res = await supabase.from('standings_vgc').select('*').eq('tournament_id', tournamentId).eq('age_division', capitalize(ageDivision)).neq('placing', 0).order('placing', { ascending: true });
  let standings = res.data ?? [];

  return standings.map((standing) => {
    const rounds: PlayerRound[] = Object.values(standing.rounds ?? {});

    return {
      ...standing,
      rounds: rounds.map((round: PlayerRound) => ({ ...round, name: cropPlayerName(round.name) })),
    }
  });
}