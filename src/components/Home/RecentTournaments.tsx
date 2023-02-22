import { memo } from 'react';
import { Tournament } from '../../../types/tournament';
import { CommonCard } from '../common/CommonCard';
import { TournamentList } from '../TournamentList/TournamentList';

export interface RecentTournamentsProps {
  tournaments: Tournament[];
}

export const RecentTournaments = memo((props: RecentTournamentsProps) => (
  <CommonCard slug='tournaments' ghost>
    <TournamentList tournaments={props.tournaments} mostRecent />
  </CommonCard>
));

RecentTournaments.displayName = 'RecentTournaments';
