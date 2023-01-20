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
import { Tournament } from '../../../types/tournament';
import { getRK9TournamentUrl } from '../Tournament/helpers';
import {
  formatTimeUntilTournament,
  formatTournamentDate,
  formatTournamentStatus,
  getTournamentStatusBadgeProps,
} from './helpers';

export const TournamentCard = ({ tournament }: { tournament: Tournament }) => {
  const linkShouldGoToRK9 = useMemo(
    () => tournament.tournamentStatus === 'not-started',
    [tournament.tournamentStatus]
  );

  return (
    <LinkBox>
      <LinkOverlay
        as={NextLink}
        href={
          linkShouldGoToRK9
            ? getRK9TournamentUrl(tournament.rk9link)
            : `/tournaments/${tournament.id}/standings`
        }
        isExternal={linkShouldGoToRK9}
      >
        <Card>
          <Stack padding={4} spacing={1}>
            <Stack spacing={0}>
              <Heading size='sm' color='gray.700'>
                {tournament.name}{' '}
                {linkShouldGoToRK9 && (
                  <Icon
                    color='gray.700'
                    mx={1}
                    boxSize={4}
                    as={ExternalLinkIcon}
                    marginBottom={1}
                  />
                )}
              </Heading>
              <div>
                <Badge {...getTournamentStatusBadgeProps(tournament)}>
                  {formatTournamentStatus(tournament)}
                </Badge>
              </div>
            </Stack>
            <Heading size={'xs'} color='gray.500' fontWeight={'semibold'}>
              {formatTournamentDate(tournament)}
            </Heading>
          </Stack>
        </Card>
      </LinkOverlay>
    </LinkBox>
  );
};
