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
}

export const fetchTournaments = async (options?: FetchTournamentsOptions) => {
  const res: Response = await fetch(
    `${
      options?.prefetch ? 'https://pokedata.ovh' : '/pokedata'
    }/standings/tournaments.json`
  );
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

  return data.slice().reverse();
};

export const fetchCurrentTournamentInfo = async (
  tournamentId: string,
  options?: {
    prefetch?: boolean;
  }
) => {
  const tournaments = await fetchTournaments(options);
  const currentTournament = tournaments?.find(({ id }) => id === tournamentId);
  return currentTournament ?? null;
};

export const useTournaments = (options?: FetchTournamentsOptions) => {
  return useQuery({
    queryKey: ['tournaments'],
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
