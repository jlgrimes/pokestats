import { memo } from 'react';
import { Tournament } from '../../../types/tournament';
import { CommonCard } from '../common/CommonCard';
import { MetaGameShareList } from '../Deck/Analytics/MetaGameShare/MetaGameShareList';

export const BiggestMovers = memo(
  ({ tournament }: { tournament: Tournament }) => {
    const tourneyId = parseInt(tournament.id);
    return (
      <CommonCard slug={`/decks`} ghost>
        <MetaGameShareList
          tournamentRange={[tourneyId, tourneyId]}
          sortByMoves
          preview
        />
      </CommonCard>
    );
  }
);

BiggestMovers.displayName = 'BiggestMovers';
