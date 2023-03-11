import { memo } from 'react';
import { Tournament } from '../../../types/tournament';
import { MetaGameShareList } from '../Deck/Analytics/MetaGameShare/MetaGameShareList';

export const TopDecks = memo(({ tournament }: { tournament: Tournament }) => {
  const tourneyId = parseInt(tournament.id);
  return <MetaGameShareList tournamentRange={[tourneyId, tourneyId]} preview />;
});

TopDecks.displayName = 'TopDecks';
