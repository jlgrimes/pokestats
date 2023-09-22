import {
  LinkBox,
} from '@chakra-ui/react';
import { Standing, Tournament } from '../../../types/tournament';
import { PlayerTournamentView } from '../Tournament/Home/PlayerTournamentView';
import { PinnedPlayerList } from '../Tournament/Home/PinnedPlayers/PinnedPlayerList';
import { TopCutViewController } from '../Tournament/Home/TopCut/TopCutViewController';
import { ChampionDisplay } from './ChampionDisplay';
import { TournamentInfo } from './TournamentInfo';
import { useSessionPlayerProfile } from '../../hooks/user';
import { Card, Flex, Grid } from '@tremor/react';

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
  const live = tournament.tournamentStatus === 'running';

  return (
    <LinkBox height='100%'>
      <Card decoration={live ? 'left' : undefined} className='flex flex-col gap-6 px-4 py-2'>
        <Flex>
          <TournamentInfo tournament={tournament} />
          {champion && <ChampionDisplay champion={champion} />}
        </Flex>
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
