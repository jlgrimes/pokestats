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
import { useQuery } from 'react-query';
import { useArchetypes } from '../../../hooks/deckArchetypes';
import { useTournamentResults } from '../../../hooks/tournamentResults';
import SpriteAndNameDisplay from '../../common/SpriteAndNameDisplay';

export default function ResultsList() {
  const tournamentName = 'Toronto 2022';
  const { data: results } = useTournamentResults(tournamentName);
  const { data: decks } = useArchetypes();

  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Place</Th>
            <Th>Name</Th>
            <Th>Deck</Th>
          </Tr>
        </Thead>
        <Tbody>
          {results?.map((result, idx) => (
            <Tr key={idx}>
              <Td>{result.place}</Td>
              <Td>{result.player_name}</Td>
              <Td>
                <SpriteAndNameDisplay
                  archetypeName={result.deck_archetype}
                  pokemonNames={
                    decks?.find(deck => deck.name === result.deck_archetype)
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
