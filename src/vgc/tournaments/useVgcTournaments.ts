import { isBefore, isSameWeek, parseISO } from "date-fns";
import supabase from "../../lib/supabase/client";
import { TournamentDate, TournamentStatus } from "../../../types/tournament";
import { useQuery } from "@tanstack/react-query";

export interface VgcTournament {
  id: number;
  name: string;
  date: TournamentDate;
  tournamentStatus: TournamentStatus;
  players: {
    juniors: number,
    seniors: number,
    masters: number
  },
  roundNumbers: {
    juniors: number | null,
    seniors: number | null,
    masters: number | null
  },
  rk9link: string,
  winners: {
    juniors: number | null,
    seniors: number | null,
    masters: number | null
  },
  subStatus: string | null,
  lastUpdated: string,
  event_type: string,
  finalized_in_standings: boolean
}

export const fetchVgcTournaments = async (): Promise<VgcTournament[]> => {
  const res = await supabase.from('tournaments_vgc').select('*');

  let tournaments = res.data ?? [];
  tournaments = tournaments.filter((tournament) => tournament.tournamentStatus !== 'not-started' || isSameWeek(parseISO(tournament.date.start), new Date()));

  return tournaments?.sort((a, b) => {
    if (isBefore(parseISO(a.date.start), parseISO(b.date.start))) return 1;
    if (isBefore(parseISO(b.date.start), parseISO(a.date.start))) return -1;
    return 0;
  }) ?? [];
}

export const useVgcTournaments = () => {
  return useQuery({
    queryKey: ['vgc-tournaments'],
    queryFn: fetchVgcTournaments
  })
}

export const fetchVgcTournament = async (tournamentId: number): Promise<VgcTournament | null> => {
  const res = await supabase.from('tournaments_vgc').select('*').eq('id', tournamentId);
  return res.data?.at(0) ?? null;
}