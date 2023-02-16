import { QueryClient } from '@tanstack/react-query';
import { fetchArchetypes } from '../../hooks/deckArchetypes';
import { fetchPokedex } from '../../hooks/images';
import { fetchTournamentMetadata } from '../../hooks/tournamentMetadata';
import {
  fetchTournaments,
  getMostRecentFinishedTournament,
} from '../../hooks/tournaments';
import { fetchLiveResults } from './fetchLiveResults';

export const prewarmMostRecentTournament = async (queryClient: QueryClient) => {
  const tournaments = await fetchTournaments();
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

  // TODO: take out, might not need
  await queryClient.prefetchQuery([`pokedex`], fetchPokedex);
  await queryClient.prefetchQuery(['deck-archetypes'], fetchArchetypes);
  // TODO: update with other tournament metadata if needed
  await queryClient.prefetchQuery(
    ['tournament-metadata', tournamentId, 'stream'],
    () => fetchTournamentMetadata(tournamentId, 'stream')
  );
};
