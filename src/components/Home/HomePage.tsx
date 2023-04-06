import { Box, Stack } from '@chakra-ui/react';
import { Tournament } from '../../../types/tournament';
import { AppLogo } from '../Layout/AppBar/AppLogo';
import { HomeIcons } from './HomeIcons';
import { RecentTournaments } from './RecentTournaments';
import { Adsense } from '@ctrl/react-adsense';

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
      <Adsense
        client='ca-pub-3066736963130742'
        slot='5583671963'
        style={{ display: 'block' }}
        format='auto'
      />
      {/* <TwitterTimeline /> */}
      {/* <TopDecks tournament={mostRecentFinishedTournament} /> */}
    </Stack>
  );
};
