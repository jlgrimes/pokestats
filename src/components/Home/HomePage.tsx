import { Stack } from '@chakra-ui/react';
import { Tournament } from '../../../types/tournament';
import { AppLogo } from '../Layout/AppBar/AppLogo';
import { RecentTournaments } from './RecentTournaments';

export interface HomePageProps {
  tournaments: Tournament[];
}

export const HomePage = (props: HomePageProps) => {
  return (
    <Stack>
      <AppLogo big />
      <RecentTournaments tournaments={props.tournaments} />
      {/* <TopDecks tournament={mostRecentFinishedTournament} /> */}
    </Stack>
  );
};
