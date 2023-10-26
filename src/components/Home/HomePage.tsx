import {
  Link,
  LinkBox,
  LinkOverlay,
  Stack,
} from '@chakra-ui/react';
import { Tournament } from '../../../types/tournament';
import { getMostRecentFinishedTournament } from '../../hooks/tournaments';
import { Footer } from '../Footer';
import { Ad } from '../Ad';
import { RecentTournaments } from './RecentTournaments';
import { useColor } from '../../hooks/useColor';
import { GameSelector } from './GameSelector';
import { SupportUsCallout } from './SupportUsCallout';

export interface HomePageProps {
  tournaments: Tournament[];
}

export const HomePage = (props: HomePageProps) => {
  const mostRecentFinishedTournament = getMostRecentFinishedTournament(
    props.tournaments
  );
  const { header, subheader } = useColor();

  return (
    <Stack spacing={4}>
      <GameSelector />
      <SupportUsCallout />
      <Ad />
      <RecentTournaments tournaments={props.tournaments} />
      {/* <LeaderboardCard /> */}
      <Ad slot='7147816871' />
      {/* <Adsense
        client='ca-pub-3066736963130742'
        slot='5583671963'
        style={{ display: 'block' }}
        format='auto'
      /> */}
      <Footer />
    </Stack>
  );
};
