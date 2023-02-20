import { QueryClient } from '@tanstack/react-query';
import { Tournament } from '../../../types/tournament';
import {
  fetchTournaments,
  getMostRecentFinishedTournament,
} from '../../hooks/tournaments';
import { fetchLiveResults } from './fetchLiveResults';

export const prewarmLiveTournamentData = async (
  queryClient: QueryClient,
  tournaments: Tournament[]
) => {
  const liveTournaments = tournaments.filter(
    tournament => tournament.tournamentStatus === 'running'
  );

  // Live tournaments should prewarm before recently finished tournaments.
  // If a recently finished tournament doesn't load right away, fine.
  // If a live tournament doesn't load right away, we have a problem!
  for await (const tournament of liveTournaments) {
    await prewarmTournament(tournament.id, queryClient);
  }

  const mostRecentFinishedTournament =
    getMostRecentFinishedTournament(tournaments);
  await prewarmTournament(mostRecentFinishedTournament.id, queryClient);
};

export const prewarmTournament = async (
  tournamentId: string,
  queryClient: QueryClient
) => {
  const queryKey = [`live-results`, tournamentId, 'allRoundData', true];
  if (queryClient.getQueryData(queryKey)) {
    return;
  }

  const currentLiveResults = await fetchLiveResults(tournamentId, {
    load: { allRoundData: true },
  });

  queryClient.setQueryData(queryKey, () => currentLiveResults);
};
