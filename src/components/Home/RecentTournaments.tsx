import { memo } from 'react';
import { Tournament } from '../../../types/tournament';
import { CommonCard } from '../common/CommonCard';
import { TournamentList } from '../TournamentList/TournamentList';

export const RecentTournaments = memo(
  ({ tournaments }: { tournaments: Tournament[] }) => (
    <CommonCard header='Tournaments' slug='/tournaments' ghost>
      <TournamentList tournaments={tournaments} mostRecent />
    </CommonCard>
  )
);

RecentTournaments.displayName = 'RecentTournaments';
