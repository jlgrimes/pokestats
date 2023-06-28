// these are all the functions to use when the API is wrong

import {
  differenceInDays,
  differenceInHours,
  isAfter,
  parseISO,
} from 'date-fns';
import { Tournament } from '../../types/tournament';
import { tournamentFallsOnCurrentDate } from '../components/TournamentList/helpers';
import { getTournamentSubStatus } from '../hooks/tournaments';
import {
  fetchLiveResults,
  getTopCutStatus,
  LiveResults,
} from './fetch/fetchLiveResults';
import { captureException } from '@sentry/browser';

export const isTournamentLongGone = (tournament: Tournament) =>
  differenceInDays(new Date(), parseISO(tournament.date.end)) > 2;

const getTournamentIsComplete = (
  tournament: Tournament,
  liveResults: LiveResults
) =>
  tournament.roundNumbers.masters ===
    (liveResults.data[0].rounds?.length ?? 0) &&
  (liveResults.data[1].rounds?.length ?? 0) ===
    (liveResults.data[0].rounds?.length ?? 0) &&
  (liveResults.data[1].rounds?.length ?? 0) >
    (liveResults.data[2].rounds?.length ?? 0);

export const getTournamentShouldBeFinished = (tournament: Tournament) => {
  return (
    tournament.tournamentStatus === 'finished' &&
    isAfter(new Date(), parseISO(tournament.date.end))
  );
};

export const getTournamentShouldBeRunning = (
  tournament: Tournament,
  liveResults: LiveResults
) => {
  if (getTournamentShouldBeFinished(tournament)) return false;

  // Tournament is complete if finals has happened and has completed.
  const butTournamentIsRunning = !getTournamentIsComplete(
    tournament,
    liveResults
  );

  return (
    (tournament && butTournamentIsRunning) ||
    (tournament.tournamentStatus === 'not-started' &&
      liveResults.data &&
      liveResults.data.length > 0)
  );
};

export const getPatchedTournament = async (
  tournamentFromApi: Tournament | null,
  preloadedLiveResults?: LiveResults,
  prefetch?: boolean
) => {
  let liveResults: LiveResults;

  if (!tournamentFromApi) return null;

  try {
    if (preloadedLiveResults) {
      liveResults = preloadedLiveResults;
    } else {
      liveResults = await fetchLiveResults(
        tournamentFromApi.id,
        {
          prefetch,
          load: { allRoundData: true },
        },
        { tournament: tournamentFromApi }
      );
    }
  
    if (!liveResults.data || liveResults.data.length === 0)
      return tournamentFromApi;
  
    const tournamentApiSaysCompleted =
      tournamentFromApi?.tournamentStatus === 'finished';
  
    const topCutStatus = getTopCutStatus(liveResults.data, tournamentFromApi);
  
    const afterDayOne =
      tournamentFromApi.lastUpdated &&
      tournamentFromApi.roundNumbers.masters === 9 &&
      differenceInHours(new Date(tournamentFromApi.lastUpdated), new Date()) >= 1;
  
    const patchedTournament: Tournament = {
      ...tournamentFromApi,
      tournamentStatus: getTournamentShouldBeRunning(
        tournamentFromApi,
        liveResults
      )
        ? 'running'
        : isTournamentLongGone(tournamentFromApi)
        ? 'finished'
        : tournamentFromApi.tournamentStatus,
      topCutStatus,
      hasStaleData:
        tournamentApiSaysCompleted &&
        !getTournamentIsComplete(tournamentFromApi, liveResults),
      subStatus: tournamentFromApi.subStatus,
    };

    return patchedTournament;
  } catch(err) {
    captureException(err);
  }
};

export const patchTournamentsClient = async (tournament: Tournament) => {
  const newTournament = await getPatchedTournament(
    tournament,
    undefined,
    false
  );

  return newTournament;
};
