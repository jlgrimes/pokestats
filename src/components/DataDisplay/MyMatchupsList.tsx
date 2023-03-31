import { usePlayerLiveResults } from '../../hooks/tournamentResults';
import { Tournament } from '../../../types/tournament';
import { memo, useMemo } from 'react';
import { RoundsList } from './RoundsList';
import { useSession } from 'next-auth/react';
import { useSessionUserProfile } from '../../hooks/user';

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
    const { data: playerProfile } = useSessionUserProfile();

    const { player, shouldHideDecks } = usePlayerLiveResults(
      tournament.id,
      user?.name,
      {
        load: { opponentRoundData: true },
      }
    );

    return player?.rounds ? (
      <RoundsList
        rounds={player.rounds}
        tournament={tournament}
        shouldHideDecks={!!shouldHideDecks}
        canEditDecks={isLoggedInUser}
      />
    ) : null;
  }
);

MyMatchupsList.displayName = 'MyMatchupsList';
