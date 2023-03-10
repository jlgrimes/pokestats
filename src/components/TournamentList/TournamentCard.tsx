import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Card,
  CardHeader,
  Stack,
  Heading,
  CardFooter,
  Button,
  LinkOverlay,
  CardBody,
  Text,
  Table,
  Tbody,
  Tr,
  Td,
  LinkBox,
  Flex,
  Badge,
  ButtonGroup,
  Icon,
  Grid,
  Box,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useMemo } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { FinalResultsSchema } from '../../../types/final-results';
import { Standing, Tournament } from '../../../types/tournament';
import {
  useCountryCode,
  useLocation,
  useUtcOffset,
} from '../../hooks/tournamentMetadata';
import { getRK9TournamentUrl } from '../Tournament/helpers';
import { CountryFlag } from '../Tournament/Home/CountryFlag';
import { getTimeUntilTournament } from '../Tournament/Home/helpers';
import { ChampionDisplay } from './ChampionDisplay';
import {
  formatTimeUntilTournament,
  formatTournamentDate,
  formatTournamentStatus,
  getTournamentStatusBadgeProps,
} from './helpers';
import { LiveTournamentLinks } from './LiveTournamentLinks';
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
      <Card
        paddingX={live ? 4 : 2}
        paddingY={live ? 6 : 4}
        height='100%'
        justifyContent={'center'}
      >
        <Grid
          gridTemplateColumns={champion ? '3fr 2fr' : 'auto'}
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
              <Heading size={live ? 'lg' : 'sm'} color='gray.700'>
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
              {live && <LiveTournamentLinks tournament={tournament} />}
            </Stack>
          </Grid>
          {champion ? <ChampionDisplay champion={champion} /> : null}
        </Grid>
      </Card>
    </LinkBox>
  );
};
