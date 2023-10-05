import { useQueries, useQuery } from '@tanstack/react-query';
import {
  addDays,
  differenceInHours,
  isAfter,
  isBefore,
  isWithinInterval,
  parseISO,
} from 'date-fns';
import { Tournament } from '../../types/tournament';
import supabase from '../lib/supabase/client';
import {
  HARDCODED_TOURNAMENT_ROUNDS,
} from '../lib/tournament';
import { AgeDivision } from '../../types/age-division';

interface FetchTournamentsOptions {
  prefetch?: boolean;
  onlyFinished?: boolean;
  excludeUpcoming?: boolean;
  tournamentId?: string;
}

export const getTournamentSubStatus = (tournament: Tournament) => {
  const maxTournamentRound = HARDCODED_TOURNAMENT_ROUNDS[tournament.id] ?? 9;

  const afterDayOne =
    tournament.lastUpdated &&
    tournament.roundNumbers.masters === maxTournamentRound &&
    differenceInHours(new Date(tournament.lastUpdated), new Date()) >= 1;

  return afterDayOne ? 'after-day-one' : null;
};

export const padTournamentId = (tournament: Tournament) => ({ ...tournament, id: String(tournament.id).padStart(7, '0') })

export const fetchTournaments = async (options?: FetchTournamentsOptions) => {
  let query = supabase
    .from('tournaments_new')
    .select(
      'id,name,date,tournamentStatus,players,roundNumbers,rk9link,winners,subStatus,format(id,format,rotation,start_date),should_reveal_decks'
    )
    .order('date->end', { ascending: false });

  if (options?.excludeUpcoming) {
    query = query.neq('tournamentStatus', 'finished');
  }

  if (options?.onlyFinished) {
    query = query.eq('tournamentStatus', 'finished');
  }

  if (options?.tournamentId) {
    query = query.eq('id', parseInt(options.tournamentId));
  }

  const res = await query.returns<Tournament[]>();

  if (!res.data) return [];

  let tournaments = res.data.map(padTournamentId);

  tournaments = tournaments.filter((tournament, idx) => !tournaments.find((otherTournament, otherIdx) => otherTournament.rk9link === tournament.rk9link && idx < otherIdx))
  tournaments = tournaments.map((tournament) => ({ ...tournament, tournamentStatus: tournament.id === '0000086' ? 'finished' : tournament.tournamentStatus}))

  return tournaments;
};

export const fetchSingleTournament = async (tournamentId: string) => {
  let query = supabase
    .from('tournaments_new')
    .select(
      'id,name,date,tournamentStatus,players,roundNumbers,rk9link,winners,subStatus,format(id,format,rotation,start_date)'
    )
    .eq('id', parseInt(tournamentId))

  const res = await query.returns<Tournament[]>();
  return res.data?.at(0) ? padTournamentId(res.data[0]) : undefined;
}

export const useTournaments = (options?: FetchTournamentsOptions) => {
  const queryKey = ['tournaments'];
  if (options?.tournamentId) queryKey.push(options.tournamentId);

  return useQuery({
    queryKey,
    queryFn: () => fetchTournaments(options),
  });
};

export const getMostRecentFinishedTournament = (tournaments: Tournament[]) =>
  tournaments.find(
    ({ name, tournamentStatus }) =>
      tournamentStatus === 'finished' && !name.includes(' Cup')
  ) as Tournament;

export const getShouldHideDecks = (tournament: Tournament, playerAgeDivision: AgeDivision) => !tournament.should_reveal_decks?.[playerAgeDivision]