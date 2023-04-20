import { memo } from 'react';
import { Tournament } from '../../../types/tournament';
import { CommonCard } from '../common/CommonCard';
import { MetaGameShareList } from '../Deck/Analytics/MetaGameShare/MetaGameShareList';

export const BiggestMovers = memo(
  ({ tournament }: { tournament: Tournament }) => {
    const tourneyId = parseInt(tournament.id);
    return (
      <CommonCard header='Big moves 🏃' slug={`/decks`} ghost>
        <MetaGameShareList tournament={tournament} sortByMoves preview />
      </CommonCard>
    );
  }
);

BiggestMovers.displayName = 'BiggestMovers';
