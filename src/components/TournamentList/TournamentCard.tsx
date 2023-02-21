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
import { TournamentStatusBadge } from './TournamentStatusBadge';

export const TournamentCard = ({
  tournament,
  live,
  champion,
}: {
  tournament: Tournament;
  live?: boolean;
  champion?: FinalResultsSchema;
}) => {
  const countryCode = useCountryCode(tournament.id);

  return (
    <LinkBox>
      <LinkOverlay as={NextLink} href={`/tournaments/${tournament.id}`}>
        <Card paddingX={live ? 6 : 2} paddingY={live ? 6 : 4}>
          <Grid
            gridTemplateColumns={champion ? '3fr 2fr' : 'auto'}
            alignItems='center'
            gap={2}
          >
            <Grid gridTemplateColumns={'3.2rem 4fr'} alignItems='center'>
              {countryCode ? (
                <Box>
                  <CountryFlag countryCode={countryCode} smol={!live} />
                </Box>
              ) : (
                <Box></Box>
              )}
              <Heading size={live ? 'lg' : 'sm'} color='gray.700'>
                {tournament.name}
              </Heading>
              <Box />
              <Stack spacing={live ? 3 : 1}>
                <Stack spacing={live ? 1 : 0}>
                  <TournamentStatusBadge
                    tournament={tournament}
                    size={live ? 'sm' : 'xs'}
                  />
                </Stack>
                {!live && (
                  <Heading size={'xs'} color='gray.500' fontWeight={'semibold'}>
                    {formatTournamentDate(tournament)}
                  </Heading>
                )}
                {live && (
                  <div>
                    <Button
                      variant='ghost'
                      rightIcon={<FaArrowRight />}
                      paddingX={1}
                    >
                      View live results
                    </Button>
                  </div>
                )}
              </Stack>
            </Grid>
            {champion ? <ChampionDisplay champion={champion} /> : null}
          </Grid>
        </Card>
      </LinkOverlay>
    </LinkBox>
  );
};
