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
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useTopPerformingPlayers } from '../../hooks/tournamentResults';
import SpriteDisplay from '../common/SpriteDisplay';

export const TournamentCard = ({
  tournament,
}: {
  tournament: Record<string, any>;
}) => {
  const topPerformingPlayers = useTopPerformingPlayers(tournament.id);

  return (
    <LinkOverlay as={NextLink} href={`/tournaments/${tournament.id}/standings`}>
      <Card>
        <Stack padding='1rem 1.5rem'>
          <Heading size='md' color='gray.700'>
            {tournament.name}
          </Heading>
          <Table variant={'unstyled'}>
            <Tbody>
              {topPerformingPlayers?.map(
                (player: Record<string, any>, idx: number) => (
                  <Tr key={idx}>
                    <Td padding='0.25rem 0.5rem'>{idx + 1}. {player?.name}</Td>
                    <Td padding='0.25rem 0.5rem'><SpriteDisplay pokemonNames={player.deck.defined_pokemon} /></Td>
                  </Tr>
                )
              )}
            </Tbody>
          </Table>
        </Stack>
      </Card>
    </LinkOverlay>
  );
};
