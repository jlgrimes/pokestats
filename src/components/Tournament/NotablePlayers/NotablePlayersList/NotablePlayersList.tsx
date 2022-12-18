import {
  Editable,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useArchetypes } from '../../../../hooks/deckArchetypes';
import { useNotablePlayers } from '../../../../hooks/notablePlayers';
import SpriteDisplay from '../../../common/SpriteDisplay';

export default function NotablePlayersList({ tournament }: { tournament: string }) {
  const { data: notablePlayers } = useNotablePlayers(tournament);
  const { data: decks } = useArchetypes();

  return (
    <TableContainer>
      <Table size={'sm'}>
        <Thead>
          <Tr>
            <Th>Player</Th>
            <Th>Deck</Th>
          </Tr>
        </Thead>
        <Tbody>
          {notablePlayers?.map((player, idx) => (
            <Tr key={idx}>
              <Td>{player.player_name}</Td>
              <Td>
                <SpriteDisplay
                  pokemonNames={
                    decks?.find(deck => deck.name === player.deck_archetype)
                      ?.defined_pokemon ?? []
                  }
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
