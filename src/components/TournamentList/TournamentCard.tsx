import {
  Card,
  Stack,
  Heading,
  LinkOverlay,
  LinkBox,
  Grid,
  Box,
  Flex,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { Standing, Tournament } from '../../../types/tournament';
import { useCountryCode } from '../../hooks/tournamentMetadata';
import { CommonCard } from '../common/CommonCard';
import { CountryFlag } from '../Tournament/Home/CountryFlag';
import { PinnedPlayerList } from '../Tournament/Home/PinnedPlayers/PinnedPlayerList';
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
  const countryCode = useCountryCode(tournament.id);
  const live = tournament.tournamentStatus === 'running';

  return (
    <LinkBox height='100%'>
      <CommonCard
        slug={
          tournament.tournamentStatus === 'running'
            ? `/tournaments/${tournament.id}`
            : undefined
        }
      >
        <Stack spacing={4}>
          <Grid
            gridTemplateColumns={
              champion ? '3fr 2fr' : live ? '3fr 1fr' : 'auto'
            }
            alignItems='center'
            gap={2}
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
                <Heading size={live ? 'md' : 'sm'} color='gray.700'>
                  {tournament.name}
                </Heading>
              </LinkOverlay>
              <Box />
              <Stack spacing={live ? 3 : 1} paddingTop={live ? 1 : 0}>
                <TournamentStatusBadge
                  tournament={tournament}
                  size={live ? 'sm' : 'xs'}
                />
                {!live && (
                  <Heading size={'xs'} color='gray.500' fontWeight={'semibold'}>
                    {formatTournamentDate(tournament)}
                  </Heading>
                )}
              </Stack>
            </Grid>
            {champion && <ChampionDisplay champion={champion} />}
            {live && (
              <Flex justifyContent={'center'} alignItems={'center'}>
                <StreamLink tournament={tournament} />
              </Flex>
            )}
          </Grid>
          {live && <PinnedPlayerList tournament={tournament} isCompact />}
        </Stack>
      </CommonCard>
    </LinkBox>
  );
};
