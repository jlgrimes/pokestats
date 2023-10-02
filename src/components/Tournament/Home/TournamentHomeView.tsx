import {
  Box,
  Grid,
  Heading,
  Stack,
} from '@chakra-ui/react';
import { Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { useCountryCode, useLocation } from '../../../hooks/tournamentMetadata';
import { StatsHeading } from '../../common/StatsHeading';
import { TopDecks } from '../../Home/TopDecks';
import { formatTournamentDate } from '../../TournamentList/helpers';
import { TournamentStatusBanner } from '../../TournamentList/TournamentStatusBanner';
import { AdminTournamentPanel } from './AdminTournamentPanel';
import { CountryFlag } from './CountryFlag';
import { PlayerTournamentView } from './PlayerTournamentView';
import { PinnedPlayerList } from './PinnedPlayers/PinnedPlayerList';
import { TopCutViewController } from './TopCut/TopCutViewController';
import { TournamentHomeLinks } from './TournamentHomeLinks';
import { useSessionPlayerProfile } from '../../../hooks/user';
import { useColor } from '../../../hooks/useColor';
import { Ad } from '../../Ad';
import { StreamIconLink } from '../TournamentLinks';
import { PageTitle } from '../../common/new/PageTitle';
import { Flex } from '@tremor/react';

export interface TournamentHomeViewProps {
  tournament: Tournament | null;
}

export const TournamentHomeView = (props: TournamentHomeViewProps) => {
  const { header, subheader } = useColor();
  const { data: profile, isAuthenticated } = useSessionPlayerProfile();
  const { data: userIsAdmin } = useUserIsAdmin();
  const { data: location } = useLocation(props.tournament?.id ?? '');
  const country = useCountryCode(props.tournament?.id ?? '');

  if (!props.tournament) return null;

  return (
    <Stack spacing={4}>
      <TournamentStatusBanner
        tournament={props.tournament}
        location={location}
      />
      <Flex className='flex-col'>
        <PageTitle>
          {props.tournament.name}
        </PageTitle>
        <Grid gridTemplateColumns={'5rem 1fr auto'} alignItems='center' rowGap={2}>
          {country ? (
            <Box>
              <CountryFlag countryCode={country} size='lg' />
            </Box>
          ) : (
            <Box></Box>
          )}
          <Stack spacing={1}>
            <StatsHeading
              headingProps={{ color: subheader, fontWeight: 'bold' }}
            >
              {formatTournamentDate(props.tournament, true)}
            </StatsHeading>
            {props.tournament.players.masters &&
              props.tournament.players.masters > 0 && (
                <StatsHeading
                  headingProps={{ color: subheader, fontWeight: 'bold' }}
                >
                  {`${props.tournament.players.masters} masters`}
                </StatsHeading>
              )}
          </Stack>
          <StreamIconLink tournament={props.tournament} />
        </Grid>
      </Flex>
      <TournamentHomeLinks tournament={props.tournament} />
      <Ad slot='7673650238' />
      {userIsAdmin && <AdminTournamentPanel tournament={props.tournament} />}
      {isAuthenticated && profile?.name && (
        <PlayerTournamentView
          tournament={props.tournament}
          playerName={profile.name}
        />
      )}
      {(props.tournament.topCutStatus ||
        props.tournament.tournamentStatus === 'finished') && (
        <TopCutViewController tournament={props.tournament} />
      )}
      {isAuthenticated &&
        props.tournament.tournamentStatus !== 'not-started' && (
          <PinnedPlayerList tournament={props.tournament} />
        )}
      {props.tournament.tournamentStatus === 'finished' && (
        <TopDecks tournament={props.tournament} />
      )}
    </Stack>
  );
};
