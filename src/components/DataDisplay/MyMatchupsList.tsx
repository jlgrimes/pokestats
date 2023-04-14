import { PlayerLiveResultsSchema, usePlayerLiveResults } from '../../hooks/tournamentResults';
import { Tournament } from '../../../types/tournament';
import { memo } from 'react';
import { RoundsList } from './RoundsList';
import { CombinedPlayerProfile } from '../../../types/player';

export const MyMatchupsList = memo(
  ({
    tournament,
    user,
    isLoggedInUser,
    livePlayerResults,
  }: {
    tournament: Tournament;
    user: CombinedPlayerProfile;
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
