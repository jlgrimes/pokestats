import {
  LinkBox,
} from '@chakra-ui/react';
import { Standing, Tournament } from '../../../types/tournament';
import { PlayerTournamentView } from '../Tournament/Home/PlayerTournamentView';
import { ChampionDisplay } from './ChampionDisplay';
import { TournamentInfo } from './TournamentInfo';
import { useSessionPlayerProfile } from '../../hooks/user';
import { Card, Flex } from '@tremor/react';
import { UpcomingTournamentMetadata } from './UpcomingTournamentMetadata';

export const TournamentCard = ({
  tournament,
  champion,
  isCompact
}: {
  tournament: Tournament;
  champion?: Standing;
  isCompact?: boolean;
}) => {
  const { data: profile, isAuthenticated } = useSessionPlayerProfile();
  const live = tournament.tournamentStatus === 'running';

  if (tournament.tournamentStatus === 'not-started' && !isCompact) {
    return (
      <Card className='flex flex-col gap-4 px-6 py-4'>
        <TournamentInfo tournament={tournament} />
        <UpcomingTournamentMetadata tournament={tournament} />
      </Card>
    )
  }

  return (
    <LinkBox height='100%'>
      <Card decoration={live ? 'left' : undefined} className='flex flex-col gap-6 px-6 py-4'>
        <TournamentInfo tournament={tournament} />
        {isAuthenticated && live && profile?.name && !isCompact && (
          <PlayerTournamentView
            tournament={tournament}
            playerName={profile.name}
          />
        )}
      </Card>
    </LinkBox>
  );
};
