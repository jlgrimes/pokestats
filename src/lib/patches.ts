// these are all the functions to use when the API is wrong

import { Tournament } from '../../types/tournament';
import { fetchLiveResults, LiveResults } from './fetch/fetchLiveResults';

export const getPatchedTournament = async (
  tournamentFromApi: Tournament | undefined,
  preloadedLiveResults?: LiveResults,
  prefetch?: boolean
) => {
  let liveResults;

  if (!tournamentFromApi) return;

  if (preloadedLiveResults) {
    liveResults = preloadedLiveResults;
  } else {
    liveResults = await fetchLiveResults(tournamentFromApi.tournamentStatus, {
      prefetch,
    });
  }

  const tournamentApiSaysCompleted =
    tournamentFromApi?.tournamentStatus === 'finished';
  const butTournamentIsRunning =
    liveResults.data[0]?.rounds && liveResults.data[0]?.rounds?.length < 18;
  if (
    liveResults.data &&
    liveResults.data.length > 0 &&
    tournamentApiSaysCompleted &&
    butTournamentIsRunning
  ) {
    return {
      ...tournamentFromApi,
      tournamentStatus: 'running',
    } as Tournament;
  }

  return tournamentFromApi;
};
