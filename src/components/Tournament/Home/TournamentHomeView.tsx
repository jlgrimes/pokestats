import {
  Box,
  Grid,
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
import { TournamentHomeLinks } from './TournamentHomeLinks';
import { useSessionPlayerProfile } from '../../../hooks/user';
import { useColor } from '../../../hooks/useColor';
import { Ad } from '../../Ad';
import { StreamIconLink } from '../TournamentLinks';
import { PageTitle } from '../../common/new/PageTitle';
import { Flex } from '@tremor/react';
import { TopCutView } from './TopCut/TopCutView';
import { MatchPointsStats } from './MatchPointsStats/MatchPointsStats';

export interface TournamentHomeViewProps {
  tournament: Tournament;
}

export const TournamentHomeView = (props: TournamentHomeViewProps) => {
  const { header, subheader } = useColor();
  const { data: profile, isAuthenticated } = useSessionPlayerProfile();
  const { data: userIsAdmin } = useUserIsAdmin();
  const { data: location } = useLocation(props.tournament);
  const country = useCountryCode(props.tournament);

  return (
    <Stack spacing={4}>
      <TournamentStatusBanner
        tournament={props.tournament}
        location={location}
      />
      <Flex className='flex-col gap-2'>
        <PageTitle>
          {props.tournament.name}
        </PageTitle>
        <Flex className='justify-center gap-4'>
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
        </Flex>
      </Flex>
      <TournamentHomeLinks tournament={props.tournament} />
      <Ad slot='7673650238' />
      {isAuthenticated && profile?.name && (
        <PlayerTournamentView
          tournament={props.tournament}
          playerName={profile.name}
        />
      )}
      {userIsAdmin && <AdminTournamentPanel tournament={props.tournament} />}
      {(props.tournament.topCutStatus ||
        props.tournament.tournamentStatus === 'finished') && (
          <>
          <TopCutView tournament={props.tournament} />
          </>
      )}
      {isAuthenticated &&
        props.tournament.tournamentStatus !== 'not-started' && (
          <PinnedPlayerList tournament={props.tournament} />
        )}
      {props.tournament.tournamentStatus === 'finished' && (
        <>
                <TopDecks tournament={props.tournament} />
        <MatchPointsStats tournament={props.tournament} ageDivision='masters' />
        </>
      )}
    </Stack>
  );
};
