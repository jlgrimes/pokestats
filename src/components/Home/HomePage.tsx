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
import { Button, Callout, Card, Flex, Icon, Text, Title } from '@tremor/react';
import { ExternalLinkIcon, HeartIcon, LinkIcon } from '@heroicons/react/outline';
import { FaExternalLinkAlt, FaPatreon } from 'react-icons/fa';

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
      <Card className='py-4'>
        <LinkOverlay href='https://www.patreon.com/bePatron?u=97204202' isExternal>
          <div className='flex items-center gap-4 mb-2'>
          <Icon variant='solid' icon={HeartIcon} color='rose' />
            <Title className='text-sm'>Support Pokéstats Live <Icon size='xs' icon={FaExternalLinkAlt} color='neutral' /></Title>
          </div>
          <div className='flex'>
            <Text>Become a Patreon to support development of the site so we can continue to make cool stuff!</Text>
          </div>
          </LinkOverlay>
      </Card>
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
