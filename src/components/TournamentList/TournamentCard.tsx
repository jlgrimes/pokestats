import {
  Stack,
  Heading,
  LinkOverlay,
  LinkBox,
  Box,
  Flex,
  useColorMode,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import NextLink from 'next/link';
import { Standing, Tournament } from '../../../types/tournament';
import { useCountryCode } from '../../hooks/tournamentMetadata';
import { CommonCard } from '../common/CommonCard';
import { CountryFlag } from '../Tournament/Home/CountryFlag';
import { PlayerTournamentView } from '../Tournament/Home/PlayerTournamentView';
import { PinnedPlayerList } from '../Tournament/Home/PinnedPlayers/PinnedPlayerList';
import { TopCutViewController } from '../Tournament/Home/TopCut/TopCutViewController';
import { StreamLink } from '../Tournament/TournamentLinks';
import { ChampionDisplay } from './ChampionDisplay';
import { formatTournamentDate } from './helpers';
import { TournamentInfo } from './TournamentInfo';
import { TournamentStatusBadge } from './TournamentStatusBadge';
import { useSessionPlayerProfile } from '../../hooks/user';
import { Card, Grid } from '@tremor/react';

export const TournamentCard = ({
  tournament,
  champion,
  disableFollowing,
  shouldHideStatus,
}: {
  tournament: Tournament;
  champion?: Standing;
  disableFollowing?: boolean;
  shouldHideStatus?: boolean;
}) => {
  const { data: profile, isAuthenticated } = useSessionPlayerProfile();
  const countryCode = useCountryCode(tournament.id);
  const live = tournament.tournamentStatus === 'running';

  return (
    <LinkBox height='100%'>
      <Card>
        <Grid className='gap-2' numItems={3}>
          {countryCode ? <CountryFlag countryCode={countryCode} size={'sm'} /> : null}
          <LinkOverlay as={NextLink} href={`/tournaments/${tournament.id}`}>
            <TournamentInfo tournament={tournament} />
          </LinkOverlay>
          {champion && <ChampionDisplay champion={champion} />}
        </Grid>


        {/* <Stack spacing={4}>
          <Grid gridTemplateColumns={'3.4fr 2fr'} alignItems='center' gap={2}>
            <Grid gridTemplateColumns={`3.4rem 4fr`} alignItems='center' rowGap={live ? 1 : 0}>
              {countryCode ? (
                <Box>
                  <CountryFlag countryCode={countryCode} size={'sm'} />
                </Box>
              ) : (
                <Box></Box>
              )}
              <LinkOverlay as={NextLink} href={`/tournaments/${tournament.id}`}>
                <TournamentInfo tournament={tournament} />
              </LinkOverlay>
              <Box />
              {!(!live && shouldHideStatus) && (
                <TournamentStatusBadge tournament={tournament} size={live ? 'sm' : 'xs'} />
              )}
            </Grid>
            {champion && <ChampionDisplay champion={champion} />}
            {live && !shouldHideStatus && (
              <Flex justifyContent={'center'} alignItems={'center'}>
                <StreamLink tournament={tournament} />
              </Flex>
            )}
          </Grid>
          {isAuthenticated && live && profile?.name && (
            <PlayerTournamentView
              tournament={tournament}
              playerName={profile.name}
            />
          )}
          {live && !tournament.topCutStatus && !disableFollowing && (
            <PinnedPlayerList tournament={tournament} isCompact />
          )}
          {live && tournament.topCutStatus && !disableFollowing && (
            <TopCutViewController tournament={tournament} />
          )}
        </Stack> */}
      </Card>
    </LinkBox>
  );
};
