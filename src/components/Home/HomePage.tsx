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
      <Stack spacing={0} paddingBottom='2'>
        <AppLogo big />
        <LinkBox>
          <LinkOverlay href={TCGPLAYER_AFFILIATE_URL} isExternal>
            <Card paddingY={2} paddingX={4} cursor='pointer'>
              <HStack justifyContent='center'>
                <Text>
                  Buy your cards{' '}
                  <Text color='blue.500' display='inline' fontWeight='bold'>
                    here
                  </Text>{' '}
                  to support the site!
                </Text>
                <Image
                  src='/TCGplayer-Primary-RGB_500px.png'
                  width='100'
                  height='50'
                  alt='TCGplayer Affiliate Link'
                />
              </HStack>
            </Card>
          </LinkOverlay>
        </LinkBox>
        {/* <HomeIcons /> */}
      </Stack>
      <Ad />
      <RecentTournaments tournaments={props.tournaments} />
      <LeaderboardCard />
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
