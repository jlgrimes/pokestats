import {
  Card,
  Stack,
  Heading,
  LinkOverlay,
  LinkBox,
  Grid,
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
import { MyTournamentView } from '../Tournament/Home/MyTournamentView';
import { PinnedPlayerList } from '../Tournament/Home/PinnedPlayers/PinnedPlayerList';
import { TopCutViewController } from '../Tournament/Home/TopCut/TopCutViewController';
import { StreamLink } from '../Tournament/TournamentLinks';
import { ChampionDisplay } from './ChampionDisplay';
import { formatTournamentDate } from './helpers';
import { TournamentStatusBadge } from './TournamentStatusBadge';

export const TournamentCard = ({
  tournament,
  champion,
}: {
  tournament: Tournament;
  champion?: Standing;
}) => {
  const { colorMode } = useColorMode();

  const session = useSession();
  const countryCode = useCountryCode(tournament.id);
  const live = tournament.tournamentStatus === 'running';

  return (
    <LinkBox height='100%'>
      <CommonCard>
        <Stack>
          <Grid
            gridTemplateColumns={
              champion ? '3fr 2fr' : live ? '3fr 1fr' : 'auto'
            }
            alignItems='center'
            gap={2}
            paddingX={live ? 1 : 0}
            paddingY={live ? 3 : 0}
          >
            <Grid
              gridTemplateColumns={`${live ? 4 : 3.4}rem 4fr`}
              alignItems='center'
            >
              {countryCode ? (
                <Box>
                  <CountryFlag
                    countryCode={countryCode}
                    size={!live ? 'sm' : 'md'}
                  />
                </Box>
              ) : (
                <Box></Box>
              )}
              <LinkOverlay as={NextLink} href={`/tournaments/${tournament.id}`}>
                <Stack spacing={1}>
                  <Heading
                    size={live ? 'md' : 'sm'}
                    color={colorMode === 'dark' ? 'gray.100' : 'gray.700'}
                  >
                    {tournament.name}
                  </Heading>
                  {!live && (
                    <Heading
                      size={'xs'}
                      color='gray.500'
                      fontWeight={'semibold'}
                    >
                      {formatTournamentDate(tournament)}
                    </Heading>
                  )}
                </Stack>
              </LinkOverlay>
              <Box />
              <Stack spacing={live ? 3 : 1} paddingTop={live ? 1 : 0}>
                <TournamentStatusBadge
                  tournament={tournament}
                  size={live ? 'sm' : 'xs'}
                />
              </Stack>
            </Grid>
            {champion && <ChampionDisplay champion={champion} />}
            {live && (
              <Flex justifyContent={'center'} alignItems={'center'}>
                <StreamLink tournament={tournament} />
              </Flex>
            )}
          </Grid>
          {session.status === 'authenticated' && live && (
            <MyTournamentView tournament={tournament} />
          )}
          {live && !tournament.topCutStatus && (
            <PinnedPlayerList tournament={tournament} isCompact />
          )}
          {live && tournament.topCutStatus && (
            <TopCutViewController tournament={tournament} />
          )}
        </Stack>
      </CommonCard>
    </LinkBox>
  );
};
