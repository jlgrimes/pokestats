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
import { Flex } from '@tremor/react';
import { AppLogo } from '../Layout/AppBar/AppLogo';
import { useShouldRemoveAds } from '../../hooks/ads';

export interface HomePageProps {
  tournaments: Tournament[];
}

export const HomePage = (props: HomePageProps) => {
  const mostRecentFinishedTournament = getMostRecentFinishedTournament(
    props.tournaments
  );
  const { header, subheader } = useColor();
  const shouldRemoveAds = useShouldRemoveAds();

  return (
    <Stack spacing={4}>
      <Flex className='px-2'>
        <AppLogo big />
        <GameSelector />
      </Flex>
      {!shouldRemoveAds && <SupportUsCallout />}
      <Ad />
      <Stack>
        <RecentTournaments tournaments={props.tournaments} />
      </Stack>
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
