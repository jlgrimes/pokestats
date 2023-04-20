import { Box, Stack } from '@chakra-ui/react';
import { Tournament } from '../../../types/tournament';
import { getMostRecentFinishedTournament } from '../../hooks/tournaments';
import { Footer } from '../Footer';
import { AppLogo } from '../Layout/AppBar/AppLogo';
import { HomeIcons } from './HomeIcons';
import { RecentTournaments } from './RecentTournaments';
import { TopDecks } from './TopDecks';

export interface HomePageProps {
  tournaments: Tournament[];
}

export const HomePage = (props: HomePageProps) => {
  const mostRecentFinishedTournament = getMostRecentFinishedTournament(
    props.tournaments
  );

  return (
    <Stack>
      <Stack spacing={0}>
        <AppLogo big />
        <HomeIcons />
      </Stack>
      <RecentTournaments tournaments={props.tournaments} />
      {/* <Adsense
        client='ca-pub-3066736963130742'
        slot='5583671963'
        style={{ display: 'block' }}
        format='auto'
      /> */}
      {mostRecentFinishedTournament && (
        <TopDecks tournament={mostRecentFinishedTournament} />
      )}
      <Footer />
    </Stack>
  );
};
