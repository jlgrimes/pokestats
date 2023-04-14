import { PlayerLiveResultsSchema, usePlayerLiveResults } from '../../hooks/tournamentResults';
import { Standing, Tournament } from '../../../types/tournament';
import { memo, useMemo } from 'react';
import { RoundsList } from './RoundsList';
import { StoredPlayerProfile } from '../../../types/player';

export const MyMatchupsList = memo(
  ({
    tournament,
    user,
    isLoggedInUser,
    livePlayerResults,
  }: {
    tournament: Tournament;
    user: StoredPlayerProfile;
    isLoggedInUser: boolean;
    livePlayerResults: PlayerLiveResultsSchema;
  }) => {
    const { player, shouldHideDecks } = livePlayerResults;

    return player?.rounds ? (
      <RoundsList
        player={player}
        tournament={tournament}
        shouldHideDecks={!!shouldHideDecks}
        canEditDecks={isLoggedInUser}
      />
    ) : null;
  }
);

MyMatchupsList.displayName = 'MyMatchupsList';
