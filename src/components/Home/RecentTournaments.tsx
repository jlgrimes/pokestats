import { memo } from 'react';
import { Tournament } from '../../../types/tournament';
import { CommonCard } from '../common/CommonCard';
import { TournamentList } from '../TournamentList/TournamentList';
import { Flex, Title } from '@tremor/react';

export interface RecentTournamentsProps {
  tournaments: Tournament[];
}

export const RecentTournaments = memo((props: RecentTournamentsProps) => (
  <>
    <TournamentList tournaments={props.tournaments} mostRecent />
  </>
));

RecentTournaments.displayName = 'RecentTournaments';
