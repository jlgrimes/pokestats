import {
  Box,
  Card,
  Heading,
  HStack,
  Image,
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Tournament } from '../../../types/tournament';
import { getMostRecentFinishedTournament } from '../../hooks/tournaments';
import { Footer } from '../Footer';
import { AppLogo } from '../Layout/AppBar/AppLogo';
import { Ad } from '../Ad';
import { HomeIcons } from './HomeIcons';
import { RecentTournaments } from './RecentTournaments';
import { TopDecks } from './TopDecks';
import { CommonCard } from '../common/CommonCard';
import { useColor } from '../../hooks/useColor';
import { TCGPLAYER_AFFILIATE_URL } from '../../lib/url';
import { TopPlayersList } from '../TopPlayers/TopPlayersList';
import { LeaderboardCard } from './LeaderboardCard';
import { Callout } from '@tremor/react';

export interface HomePageProps {
  tournaments: Tournament[];
}

export const HomePage = (props: HomePageProps) => {
  const mostRecentFinishedTournament = getMostRecentFinishedTournament(
    props.tournaments
  );
  const { header, subheader } = useColor();

  return (
    <Stack>
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
      {mostRecentFinishedTournament && (
        <TopDecks tournament={mostRecentFinishedTournament} />
      )}
      <Footer />
    </Stack>
  );
};
