import { usePlayerLiveResults } from '../../hooks/tournamentResults';
import { Tournament } from '../../../types/tournament';
import { memo, useMemo } from 'react';
import { RoundsList } from './RoundsList';

export const MyMatchupsList = memo(
  ({
    tournament,
    user,
  }: {
    tournament: Tournament;
    user: Record<string, any> | undefined;
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
        rounds={player.rounds}
        tournament={tournament}
        shouldHideDecks={!!shouldHideDecks}
        canEditDecks
      />
    ) : null;
  }
);

MyMatchupsList.displayName = 'MyMatchupsList';
