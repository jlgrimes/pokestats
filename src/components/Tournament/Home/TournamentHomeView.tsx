import {
  Badge,
  Box,
  Grid,
  Heading,
  HStack,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { Fragment } from 'react';
import {
  FaCalendar,
  FaClock,
  FaMapMarker,
  FaMapMarkerAlt,
  FaRegClock,
} from 'react-icons/fa';
import { Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { useCountryCode, useLocation } from '../../../hooks/tournamentMetadata';
import { OpenEditTournamentInfo } from '../../Admin/EditTournamentInfo/OpenEditTournamentInfo';
import { StatsHeading } from '../../common/StatsHeading';
import { TopDecks } from '../../Home/TopDecks';
import { formatTournamentDate } from '../../TournamentList/helpers';
import { TournamentStatusBadge } from '../../TournamentList/TournamentStatusBadge';
import { TournamentStatusBanner } from '../../TournamentList/TournamentStatusBanner';
import { AdminTournamentPanel } from './AdminTournamentPanel';
import { CountryFlag } from './CountryFlag';
import { getLocalTime, isInSameTimeZone } from './helpers';
import { MyTournamentView } from './MyTournamentView';
import { PinnedPlayerList } from './PinnedPlayers/PinnedPlayerList';
import { TopCutViewController } from './TopCut/TopCutViewController';
import { TournamentHomeLinks } from './TournamentHomeLinks';

export interface TournamentHomeViewProps {
  tournament: Tournament | null;
}

export const TournamentHomeView = (props: TournamentHomeViewProps) => {
  const { data: userIsAdmin } = useUserIsAdmin();
  const session = useSession();
  const { data: location } = useLocation(props.tournament?.id ?? '');
  const country = useCountryCode(props.tournament?.id ?? '');

  if (!props.tournament) return null;

  return (
    <Stack spacing={4}>
      <TournamentStatusBanner
        tournament={props.tournament}
        location={location}
      />
      <Stack paddingX={6} spacing={4}>
        <Stack spacing={2} alignItems='center'>
          <Grid
            gridTemplateColumns={'5.5rem auto'}
            alignItems='center'
            rowGap={2}
          >
            {country ? (
              <Box>
                <CountryFlag countryCode={country} size='lg' />
              </Box>
            ) : (
              <Box></Box>
            )}
            <Heading size='xl' color='gray.700' lineHeight={'2.25rem'}>
              {props.tournament.name}
            </Heading>
            <Box />
            <Stack>
              <StatsHeading
                headingProps={{ color: 'gray.500', fontWeight: 'bold' }}
              >
                {formatTournamentDate(props.tournament, true)}
              </StatsHeading>
              <StatsHeading
                headingProps={{ color: 'gray.500', fontWeight: 'bold' }}
              >
                {`${props.tournament.players.masters} masters`}
              </StatsHeading>
            </Stack>
          </Grid>
        </Stack>
        <TournamentHomeLinks tournament={props.tournament} />
      </Stack>
      {userIsAdmin && <AdminTournamentPanel tournament={props.tournament} />}
      {(props.tournament.topCutStatus ||
        props.tournament.tournamentStatus === 'finished') && (
        <TopCutViewController tournament={props.tournament} />
      )}
      {session.status === 'authenticated' && (
        <Fragment>
          <MyTournamentView tournament={props.tournament} />
          {props.tournament.tournamentStatus !== 'not-started' && (
            <PinnedPlayerList tournament={props.tournament} />
          )}
        </Fragment>
      )}
      {props.tournament.tournamentStatus === 'finished' && (
        <TopDecks tournament={props.tournament} />
      )}
    </Stack>
  );
};
