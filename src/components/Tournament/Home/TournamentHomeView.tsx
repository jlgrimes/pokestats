import {
  Badge,
  Box,
  Grid,
  Heading,
  HStack,
  Stack,
  Text,
  useColorMode,
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
import { PlayerTournamentView } from './PlayerTournamentView';
import { PinnedPlayerList } from './PinnedPlayers/PinnedPlayerList';
import { TopCutViewController } from './TopCut/TopCutViewController';
import { TournamentHomeLinks } from './TournamentHomeLinks';

export interface TournamentHomeViewProps {
  tournament: Tournament | null;
}

export const TournamentHomeView = (props: TournamentHomeViewProps) => {
  const { colorMode } = useColorMode();

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
          <Stack>
            <Heading
              size='xl'
              color={colorMode === 'dark' ? 'gray.100' : 'gray.700'}
              lineHeight={'2.25rem'}
            >
              {props.tournament.name}
            </Heading>
            <Grid
              gridTemplateColumns={'5rem auto'}
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
              <Stack spacing={1}>
                <StatsHeading
                  headingProps={{ color: 'gray.500', fontWeight: 'bold' }}
                >
                  {formatTournamentDate(props.tournament, true)}
                </StatsHeading>
                {props.tournament.players.masters &&
                  props.tournament.players.masters > 0 && (
                    <StatsHeading
                      headingProps={{ color: 'gray.500', fontWeight: 'bold' }}
                    >
                      {`${props.tournament.players.masters} masters`}
                    </StatsHeading>
                  )}
              </Stack>
            </Grid>
          </Stack>
        </Stack>
        <TournamentHomeLinks tournament={props.tournament} />
      </Stack>
      {userIsAdmin && <AdminTournamentPanel tournament={props.tournament} />}
      {session.status === 'authenticated' && session.data.user?.name && (
        <PlayerTournamentView
          tournament={props.tournament}
          playerName={session.data.user.name}
        />
      )}
      {(props.tournament.topCutStatus ||
        props.tournament.tournamentStatus === 'finished') && (
        <TopCutViewController tournament={props.tournament} />
      )}
      {session.status === 'authenticated' &&
        props.tournament.tournamentStatus !== 'not-started' && (
          <PinnedPlayerList tournament={props.tournament} />
        )}
      {props.tournament.tournamentStatus === 'finished' && (
        <TopDecks tournament={props.tournament} />
      )}
    </Stack>
  );
};
