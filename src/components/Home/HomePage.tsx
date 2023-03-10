import { Box, Stack } from '@chakra-ui/react';
import { Tournament } from '../../../types/tournament';
import { AppLogo } from '../Layout/AppBar/AppLogo';
import { HomeIcons } from './HomeIcons';
import { RecentTournaments } from './RecentTournaments';
import { TwitterTimeline } from './TwitterTimeline';

export interface HomePageProps {
  tournaments: Tournament[];
}

export const HomePage = (props: HomePageProps) => {
  return (
    <Stack>
      <Stack spacing={0}>
        <AppLogo big />
        <HomeIcons />
      </Stack>
      <RecentTournaments tournaments={props.tournaments} />
      <TwitterTimeline />
      {/* <TopDecks tournament={mostRecentFinishedTournament} /> */}
    </Stack>
  );
};
