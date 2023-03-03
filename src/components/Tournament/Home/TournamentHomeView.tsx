import { Badge, Box, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { Fragment } from 'react';
import {
  FaClock,
  FaMapMarker,
  FaMapMarkerAlt,
  FaRegClock,
} from 'react-icons/fa';
import { Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { useCountryCode, useLocation } from '../../../hooks/tournamentMetadata';
import { OpenEditTournamentInfo } from '../../Admin/EditTournamentInfo/OpenEditTournamentInfo';
import { TopDecks } from '../../Home/TopDecks';
import { TournamentStatusBadge } from '../../TournamentList/TournamentStatusBadge';
import { TournamentStatusBanner } from '../../TournamentList/TournamentStatusBanner';
import { AdminTournamentPanel } from './AdminTournamentPanel';
import { CountryFlag } from './CountryFlag';
import { getLocalTime, isInSameTimeZone } from './helpers';
import { MyTournamentView } from './MyTournamentView';
import { PinnedPlayerList } from './PinnedPlayers/PinnedPlayerList';
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
      <TournamentStatusBanner tournament={props.tournament} />
      <Stack paddingX={6} spacing={4}>
        <Stack spacing={2} alignItems='center'>
          <Heading size='xl' color='gray.700' textAlign={'center'}>
            {props.tournament.name}
          </Heading>
          {location && country && (
            <HStack spacing={2}>
              <CountryFlag countryCode={country} />
              <Stack spacing={0}>
                <Box>
                  <Badge>
                    <HStack>
                      <FaMapMarkerAlt />
                      <Text>{location.formatted_address}</Text>
                    </HStack>
                  </Badge>
                </Box>
                {!isInSameTimeZone(location.utc_offset_minutes) && (
                  <Box>
                    <Badge>
                      <HStack>
                        <FaRegClock />
                        <Text>{`Local time: ${getLocalTime(
                          location.utc_offset_minutes
                        )}`}</Text>
                      </HStack>
                    </Badge>
                  </Box>
                )}
              </Stack>
            </HStack>
          )}
        </Stack>
        <TournamentHomeLinks tournament={props.tournament} />
      </Stack>
      {userIsAdmin && <AdminTournamentPanel tournament={props.tournament} />}
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
