import { QueryClient } from '@tanstack/react-query';
import { fetchArchetypes } from '../../hooks/deckArchetypes';
import { fetchPokedex } from '../../hooks/images';
import { fetchTournamentMetadata } from '../../hooks/tournamentMetadata';
import {
  fetchTournaments,
  getMostRecentFinishedTournament,
} from '../../hooks/tournaments';
import { patchTournamentsClient } from '../patches';
import { fetchLiveResults } from './fetchLiveResults';

export const prewarmMostRecentTournament = async (queryClient: QueryClient) => {
  const tournaments = await fetchTournaments();
  const patchedTournaments = await patchTournamentsClient(tournaments);
  const mostRecentFinishedTournament =
    getMostRecentFinishedTournament(patchedTournaments);
  await prewarmTournament(mostRecentFinishedTournament.id, queryClient);
};

export const prewarmTournament = async (tournamentId: string, queryClient: QueryClient) => {
  const currentLiveResults = await fetchLiveResults(tournamentId, {
    load: { allRoundData: true },
  });

  console.log([`live-results`, tournamentId, 'allRoundData', true])
  queryClient.setQueryData(
    [`live-results`, tournamentId, 'allRoundData', true],
    () => currentLiveResults
  );

  // TODO: take out, might not need
  await queryClient.prefetchQuery([`pokedex`], fetchPokedex);
  await queryClient.prefetchQuery(['deck-archetypes'], fetchArchetypes);
  // TODO: update with other tournament metadata if needed
  await queryClient.prefetchQuery(
    ['tournament-metadata', tournamentId, 'stream'],
    () => fetchTournamentMetadata(tournamentId, 'stream')
  );
};
