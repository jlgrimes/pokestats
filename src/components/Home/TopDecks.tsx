import { memo } from 'react';
import { Tournament } from '../../../types/tournament';
import { reallyShortenTournamentName } from '../../lib/tournament';
import { MetaGameShareList } from '../Deck/Analytics/MetaGameShare/MetaGameShareList';

export const TopDecks = memo(({ tournament }: { tournament: Tournament }) => {
  const tourneyId = parseInt(tournament.id);
  return <MetaGameShareList tournament={tournament} />;
});

TopDecks.displayName = 'TopDecks';
