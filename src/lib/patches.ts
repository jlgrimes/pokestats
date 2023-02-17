// these are all the functions to use when the API is wrong

import { differenceInDays, parseISO } from 'date-fns';
import { Tournament } from '../../types/tournament';
import { tournamentFallsOnCurrentDate } from '../components/TournamentList/helpers';
import {
  fetchLiveResults,
  getTopCutStatus,
  LiveResults,
} from './fetch/fetchLiveResults';

export const getPatchedTournament = async (
  tournamentFromApi: Tournament | null,
  preloadedLiveResults?: LiveResults,
  prefetch?: boolean
) => {
  let liveResults;

  if (!tournamentFromApi) return null;

  if (preloadedLiveResults) {
    liveResults = preloadedLiveResults;
  } else {
    liveResults = await fetchLiveResults(tournamentFromApi.id, {
      prefetch,
      load: { allRoundData: true },
    });
  }

  if (!liveResults.data || liveResults.data.length === 0) return tournamentFromApi;

  const tournamentApiSaysCompleted =
    tournamentFromApi?.tournamentStatus === 'finished';
  // Tournament is complete if finals has happened and has completed.
  const tournamentIsComplete =
    (liveResults.data[1].rounds?.length ?? 0) ===
      (liveResults.data[0].rounds?.length ?? 0) &&
    (liveResults.data[1].rounds?.length ?? 0) >
      (liveResults.data[2].rounds?.length ?? 0);

  const butTournamentIsRunning =
    liveResults.data[0]?.record.wins > 0 &&
    liveResults.data[0]?.record.wins +
      liveResults.data[0]?.record.ties +
      liveResults.data[0]?.record.losses <
      16;
  const topCutStatus = getTopCutStatus(liveResults.data, tournamentFromApi);

  const tournamentShouldBeRunning =
    (tournamentApiSaysCompleted && butTournamentIsRunning) ||
    (tournamentFromApi.tournamentStatus === 'not-started' &&
      liveResults.data &&
      liveResults.data.length > 0);
  
  const now = new Date();
  const tournamentIsLongGone = differenceInDays(parseISO(tournamentFromApi.date.end), now) > 4;

  const patchedTournament: Tournament = {
    ...tournamentFromApi,
    tournamentStatus: (tournamentShouldBeRunning && !tournamentIsLongGone)
      ? 'running'
      : tournamentFromApi.tournamentStatus,
    topCutStatus,
    hasStaleData: tournamentApiSaysCompleted && !tournamentIsComplete,
  };

  return patchedTournament;
};

export const patchTournamentsClient = async (tournament: Tournament) => {
  const newTournament = await getPatchedTournament(
    tournament,
    undefined,
    false
  );

  return newTournament;
};
