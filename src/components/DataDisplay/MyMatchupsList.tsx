import { usePlayerLiveResults } from '../../hooks/tournamentResults';
import { Tournament } from '../../../types/tournament';
import { memo, useMemo } from 'react';
import { RoundsList } from './RoundsList';

export const MyMatchupsList = memo(
  ({
    tournament,
    user,
    isLoggedInUser,
  }: {
    tournament: Tournament;
    user: Record<string, any> | undefined;
    isLoggedInUser: boolean;
  }) => {
    const { player, shouldHideDecks } = usePlayerLiveResults(
      tournament.id,
      user?.name,
      {
        load: { opponentRoundData: true },
      }
    );

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
