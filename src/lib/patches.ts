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
    liveResults = await fetchLiveResults(tournamentFromApi.id, {
      prefetch,
    });
  }

  const tournamentApiSaysCompleted =
    tournamentFromApi?.tournamentStatus === 'finished';
  const butTournamentIsRunning =
    liveResults.data[0]?.record.wins > 0 &&
    liveResults.data[0]?.record.wins +
      liveResults.data[0]?.record.ties +
      liveResults.data[0]?.record.losses <
      18;
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

export const patchTournamentsClient = async (
  tournamentList: Tournament[],
  setTournamentsState: (tournaments: Tournament[]) => void
) => {
  const newTournamentsList = [];
  for await (const tournament of tournamentList) {
    const newTournament = await getPatchedTournament(
      tournament,
      undefined,
      false
    );

    if (newTournament) {
      newTournamentsList.push(newTournament);
    }
  }

  console.log(newTournamentsList)
  setTournamentsState(newTournamentsList);
};
