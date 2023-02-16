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
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useMemo } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { Tournament } from '../../../types/tournament';
import { getRK9TournamentUrl } from '../Tournament/helpers';
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
}: {
  tournament: Tournament;
  live?: boolean;
}) => {
  return (
    <LinkBox>
      <LinkOverlay as={NextLink} href={`/tournaments/${tournament.id}`}>
        <Card>
          <Stack padding={live ? 6 : 4} spacing={live ? 3 : 1}>
            <Stack spacing={live ? 1 : 0}>
              <Heading size={live ? 'lg' : 'sm'} color='gray.700'>
                {tournament.name}
              </Heading>
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
        </Card>
      </LinkOverlay>
    </LinkBox>
  );
};
