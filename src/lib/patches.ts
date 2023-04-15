// these are all the functions to use when the API is wrong

import { differenceInDays, differenceInHours, parseISO } from 'date-fns';
import { Tournament } from '../../types/tournament';
import { tournamentFallsOnCurrentDate } from '../components/TournamentList/helpers';
import { getTournamentSubStatus } from '../hooks/tournaments';
import {
  fetchLiveResults,
  getTopCutStatus,
  LiveResults,
} from './fetch/fetchLiveResults';

export const isTournamentLongGone = (tournament: Tournament) =>
  differenceInDays(new Date(), parseISO(tournament.date.end)) > 4;

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

  if (!liveResults.data || liveResults.data.length === 0)
    return tournamentFromApi;

  const tournamentApiSaysCompleted =
    tournamentFromApi?.tournamentStatus === 'finished';
  // Tournament is complete if finals has happened and has completed.
  const tournamentIsComplete =
    tournamentFromApi.roundNumbers.masters ===
      (liveResults.data[0].rounds?.length ?? 0) &&
    (liveResults.data[1].rounds?.length ?? 0) ===
      (liveResults.data[0].rounds?.length ?? 0) &&
    (liveResults.data[1].rounds?.length ?? 0) >
      (liveResults.data[2].rounds?.length ?? 0);

  const butTournamentIsRunning = !tournamentIsComplete;
  const topCutStatus = getTopCutStatus(liveResults.data, tournamentFromApi);

  const tournamentShouldBeRunning =
    (tournamentApiSaysCompleted && butTournamentIsRunning) ||
    (tournamentFromApi.tournamentStatus === 'not-started' &&
      liveResults.data &&
      liveResults.data.length > 0);

  const afterDayOne =
    tournamentFromApi.lastUpdated &&
    tournamentFromApi.roundNumbers.masters === 9 &&
    differenceInHours(new Date(tournamentFromApi.lastUpdated), new Date()) >= 1;

  const patchedTournament: Tournament = {
    ...tournamentFromApi,
    tournamentStatus: tournamentShouldBeRunning
      ? 'running'
      : isTournamentLongGone(tournamentFromApi)
      ? 'finished'
      : tournamentFromApi.tournamentStatus,
    topCutStatus,
    hasStaleData: tournamentApiSaysCompleted && !tournamentIsComplete,
    subStatus: tournamentFromApi.subStatus,
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
