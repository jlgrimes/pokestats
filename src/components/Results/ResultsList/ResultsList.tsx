import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useArchetypes } from '../../../hooks/deckArchetypes';
import { useLiveTournamentResults, useTournamentResults } from '../../../hooks/tournamentResults';
import SpriteAndNameDisplay from '../../common/SpriteAndNameDisplay';

export default function ResultsList({ tournament }: { tournament: { id: string, name: string } }) {
  const { data: liveResults } = useLiveTournamentResults(tournament.id);
  const { data: results } = useTournamentResults(tournament.name);
  const { data: decks } = useArchetypes();
  console.log(liveResults)

  return (
    <TableContainer>
      <Table size={'sm'}>
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
