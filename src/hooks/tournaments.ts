import { useQuery } from '@tanstack/react-query';
import { isAfter, isBefore, parseISO } from 'date-fns';
import { useState } from 'react';
import { Tournament } from '../../types/tournament';
import { patchTournamentsClient } from '../lib/patches';
import { shortenTournamentName } from '../lib/tournament';

interface FetchTournamentsOptions {
  prefetch?: boolean;
  onlyFinished?: boolean;
  excludeUpcoming?: boolean;
  tournamentId?: string;
}

export const fetchTournaments = async (options?: FetchTournamentsOptions) => {
  const url = options?.prefetch ? 'https://pokedata.ovh/standings/tournaments.json' : '/api/tournaments';

  const res: Response = await fetch(url);
  let data: Tournament[] = await res.json();
  data = data.map(tournament => ({
    ...tournament,
    name: shortenTournamentName(tournament),
  }));

  data = data.map(tournament => {
    if (isBefore(new Date(), parseISO(tournament.date.start))) {
      return {
        ...tournament,
        tournamentStatus: 'not-started',
      };
    }

    if (isAfter(new Date(), parseISO(tournament.date.start))) {
      return {
        ...tournament,
        tournamentStatus: 'finished',
      };
    }

    return tournament;
  });

  if (options?.onlyFinished) {
    data = data.filter(
      tournament => tournament.tournamentStatus === 'finished'
    );
  }

  if (options?.excludeUpcoming) {
    data = data.filter(
      tournament =>
        tournament.tournamentStatus !== 'not-started' &&
        // something's wrong with tournament 0000019 i guess
        tournament.id !== '0000019'
    );
  }

  if (options?.tournamentId) {
    data = data.filter(tournament => tournament.id === options.tournamentId);
  }

  return data.slice().reverse();
};

export const useTournaments = (options?: FetchTournamentsOptions) => {
  const queryKey = ['tournaments'];
  if (options?.tournamentId) queryKey.push(options.tournamentId);

  return useQuery({
    queryKey,
    queryFn: () => fetchTournaments(options),
  });
};

export const usePatchedTournaments = (tournaments: Tournament[]) => {
  return useQuery({
    queryKey: ['patched-tournaments'],
    queryFn: () => {
      return patchTournamentsClient(tournaments);
    },
  });
};

export const getMostRecentFinishedTournament = (tournaments: Tournament[]) =>
  tournaments.find(
    ({ tournamentStatus }) => tournamentStatus === 'finished'
  ) as Tournament;
