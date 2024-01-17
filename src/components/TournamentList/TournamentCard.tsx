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
}: {
  tournament: Tournament;
  champion?: Standing;
}) => {
  const { data: profile, isAuthenticated } = useSessionPlayerProfile();
  const live = tournament.tournamentStatus === 'running';

  if (tournament.tournamentStatus === 'not-started') {
    return (
      <Card className='flex flex-col gap-4 px-6 py-4'>
        <Flex>
          <TournamentInfo tournament={tournament} />
        </Flex>
        <UpcomingTournamentMetadata tournament={tournament} />
      </Card>
    )
  }

  return (
    <LinkBox height='100%'>
      <Card decoration={live ? 'left' : undefined} className='flex flex-col gap-6 px-6 py-4'>
        <Flex>
          <TournamentInfo tournament={tournament} />
          {champion && <ChampionDisplay champion={champion} />}
        </Flex>
        {isAuthenticated && live && profile?.name && (
          <PlayerTournamentView
            tournament={tournament}
            playerName={profile.name}
          />
        )}
      </Card>
    </LinkBox>
  );
};
