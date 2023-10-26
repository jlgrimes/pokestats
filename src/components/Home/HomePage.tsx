import {
  Link,
  LinkBox,
  LinkOverlay,
  Stack,
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
import { Bold, Button, Callout, Card, Flex, Icon, Text, Title } from '@tremor/react';
import { ExternalLinkIcon, HeartIcon, LinkIcon } from '@heroicons/react/outline';
import { FaExternalLinkAlt, FaPatreon } from 'react-icons/fa';
import { GameSelector } from './GameSelector';

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
      <LinkBox>
      <LinkOverlay href='https://www.patreon.com/bePatron?u=97204202' isExternal>
        <Callout title='Support Pokéstats Live' icon={HeartIcon} color='pink'>Support development through <Bold>Patreon</Bold> <Icon size='xs' icon={FaExternalLinkAlt} color='pink' /> to help keep the site available - thank you!</Callout>
          </LinkOverlay>
      </LinkBox>
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
