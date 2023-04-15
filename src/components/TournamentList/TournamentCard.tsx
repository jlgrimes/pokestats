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
import { PlayerTournamentView } from '../Tournament/Home/PlayerTournamentView';
import { PinnedPlayerList } from '../Tournament/Home/PinnedPlayers/PinnedPlayerList';
import { TopCutViewController } from '../Tournament/Home/TopCut/TopCutViewController';
import { StreamLink } from '../Tournament/TournamentLinks';
import { ChampionDisplay } from './ChampionDisplay';
import { formatTournamentDate } from './helpers';
import { TournamentInfo } from './TournamentInfo';
import { TournamentStatusBadge } from './TournamentStatusBadge';

export const TournamentCard = ({
  tournament,
  champion,
  disableFollowing,
}: {
  tournament: Tournament;
  champion?: Standing;
  disableFollowing?: boolean;
}) => {
  const { colorMode } = useColorMode();

  const session = useSession();
  const countryCode = useCountryCode(tournament.id);
  const live = tournament.tournamentStatus === 'running';

  return (
    <LinkBox height='100%'>
      <CommonCard>
        <Stack spacing={4}>
          <Grid
            gridTemplateColumns={champion || live ? '3fr 2fr' : 'auto'}
            alignItems='center'
            gap={2}
          >
            <Grid gridTemplateColumns={`3.4rem 4fr`} alignItems='center'>
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
              <TournamentStatusBadge tournament={tournament} size={'xs'} />
            </Grid>
            {champion && <ChampionDisplay champion={champion} />}
            {live && (
              <Flex justifyContent={'center'} alignItems={'center'}>
                <StreamLink tournament={tournament} />
              </Flex>
            )}
          </Grid>
          {session.status === 'authenticated' &&
            live &&
            session.data.user?.name && (
              <PlayerTournamentView
                tournament={tournament}
                playerName={session.data.user.name}
              />
            )}
          {live && !tournament.topCutStatus && !disableFollowing && (
            <PinnedPlayerList tournament={tournament} isCompact />
          )}
          {live && tournament.topCutStatus && !disableFollowing && (
            <TopCutViewController tournament={tournament} />
          )}
        </Stack>
      </CommonCard>
    </LinkBox>
  );
};
