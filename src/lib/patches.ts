// these are all the functions to use when the API is wrong

import { Tournament } from '../../types/tournament';
import { tournamentFallsOnCurrentDate } from '../components/TournamentList/helpers';
import {
  fetchLiveResults,
  getTopCutStatus,
  LiveResults,
} from './fetch/fetchLiveResults';

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
      load: { allRoundData: true },
    });
  }

  const tournamentApiSaysCompleted =
    tournamentFromApi?.tournamentStatus === 'finished';
  const tournamentIsComplete =
    (liveResults.data[1].rounds?.length ?? 0) <
    (liveResults.data[0].rounds?.length ?? 0);

  const butTournamentIsRunning =
    liveResults.data[0]?.record.wins > 0 &&
    liveResults.data[0]?.record.wins +
      liveResults.data[0]?.record.ties +
      liveResults.data[0]?.record.losses <
      18;
  const tournamentIsHappeningNow =
    tournamentFallsOnCurrentDate(tournamentFromApi);
  const topCutStatus = getTopCutStatus(liveResults.data, tournamentFromApi);

  if (
    liveResults.data &&
    liveResults.data.length > 0 &&
    tournamentApiSaysCompleted &&
    butTournamentIsRunning &&
    tournamentIsHappeningNow
  ) {
    return {
      ...tournamentFromApi,
      tournamentStatus: 'running',
      topCutStatus,
    } as Tournament;
  } else if (tournamentApiSaysCompleted && !tournamentIsComplete) {
    return {
      ...tournamentFromApi,
      hasStaleData: true,
    };
  }

  return tournamentFromApi;
};

export const patchTournamentsClient = async (tournamentList: Tournament[]) => {
  const newTournamentsList = [];
  for await (const tournament of tournamentList) {
    const newTournament = tournamentFallsOnCurrentDate(tournament)
      ? await getPatchedTournament(tournament, undefined, false)
      : null;

    if (newTournament) {
      newTournamentsList.push(newTournament);
    } else {
      newTournamentsList.push(tournament);
    }
  }

  return newTournamentsList;
};
