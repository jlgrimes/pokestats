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
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { Tournament } from '../../../types/tournament';
import {
  formatTournamentDate,
  formatTournamentStatus,
  getTournamentStatusBadgeProps,
} from './helpers';

export const TournamentCard = ({ tournament }: { tournament: Tournament }) => {
  return (
    <LinkBox>
      <Card>
        <Stack padding='1rem 1.5rem' spacing={1}>
          <LinkOverlay
            as={NextLink}
            href={`/tournaments/${tournament.id}/standings`}
          >
            <Heading size='sm' color='gray.700'>
              {tournament.name}
            </Heading>
            <Text fontSize={'sm'}>
              {formatTournamentDate(tournament)}
            </Text>
          </LinkOverlay>
          <div>
            <Badge {...getTournamentStatusBadgeProps(tournament)}>
              {formatTournamentStatus(tournament)}
            </Badge>
          </div>
        </Stack>
      </Card>
    </LinkBox>
  );
};
