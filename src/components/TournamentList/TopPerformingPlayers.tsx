import {
  Stack,
  Text,
  Table,
  Tbody,
  Tr,
  Td,
} from '@chakra-ui/react';
import { useTopPerformingPlayers } from '../../hooks/tournamentResults';
import SpriteDisplay from '../common/SpriteDisplay';
import { PlayerNameLink } from '../Player/PlayerNameLink';

export const TopPerformingPlayers = ({ tournamentId }: { tournamentId: string}) => {
  const topPerformingPlayers = useTopPerformingPlayers(tournamentId);

  return (
    <Table variant={'unstyled'}>
      <Tbody>
        {topPerformingPlayers?.map(
          (player: Record<string, any>, idx: number) => (
            <Tr key={idx}>
              <Td padding='0.25rem 0.5rem'>
                <Stack direction={'row'}>
                  <Text>{idx + 1}.</Text>{' '}
                  <PlayerNameLink
                    name={player.name}
                    twitterHandle={player.twitter_handle}
                  />
                </Stack>
              </Td>
              <Td padding='0.25rem 0.5rem'>
                <SpriteDisplay pokemonNames={player.deck.defined_pokemon} />
              </Td>
            </Tr>
          )
        )}
      </Tbody>
    </Table>
  );
};
