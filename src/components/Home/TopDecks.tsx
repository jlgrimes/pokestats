import { memo } from 'react';
import { Tournament } from '../../../types/tournament';
import { shortenTournamentName } from '../../lib/tournament';
import { CommonCard } from '../common/CommonCard';
import { MetaGameShareList } from '../Deck/Analytics/MetaGameShare/MetaGameShareList';

export const TopDecks = memo(({ tournament }: { tournament: Tournament }) => {
  const tourneyId = parseInt(tournament.id);
  return (
    <CommonCard
      header={`Top Performing Decks`}
      subheader={`${shortenTournamentName(tournament)}`}
      slug={`/decks`}
      ghost
    >
      <MetaGameShareList
        tournamentRange={[tourneyId, tourneyId]}
        preview
      />
    </CommonCard>
  );
});

TopDecks.displayName = 'TopDecks';
