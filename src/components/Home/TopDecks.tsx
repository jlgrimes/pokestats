import { Spinner } from '@chakra-ui/react';
import { memo } from 'react';
import { Tournament } from '../../../types/tournament';
import { shortenTournamentName } from '../../lib/tournament';
import { CommonCard } from '../common/CommonCard';
import { MetaGameShareList } from '../Deck/Analytics/MetaGameShare/MetaGameShareList';

export const TopDecks = memo(({ tournament }: { tournament: Tournament }) => {
  const tourneyId = parseInt(tournament.id);
  return <MetaGameShareList tournamentRange={[tourneyId, tourneyId]} preview />;
});

TopDecks.displayName = 'TopDecks';
