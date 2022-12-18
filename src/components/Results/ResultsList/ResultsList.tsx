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
import {
  useLiveTournamentResults,
  useTournamentResults,
} from '../../../hooks/tournamentResults';
import SpriteAndNameDisplay from '../../common/SpriteAndNameDisplay';
import DeckInput from './DeckInput/DeckInput';
import { formatRecord } from './helpers';

export default function ResultsList({
  tournament,
  allowEdits,
}: {
  tournament: { id: string; name: string };
  allowEdits: boolean;
}) {
  const { data: liveResults } = useLiveTournamentResults(tournament.id);
  const { data: results } = useTournamentResults(tournament.name);
  const { data: decks } = useArchetypes();

  return (
    <TableContainer>
      <Table size={'sm'}>
        <Thead>
          <Tr>
            <Th maxWidth={'0.5rem'}>Place</Th>
            <Th>Name</Th>
            <Th>Record</Th>
            <Th>Deck</Th>
          </Tr>
        </Thead>
        <Tbody>
          {liveResults?.data?.map(
            (
              result: {
                placing: string;
                name: string;
                record: { wins: number; losses: number; ties: number };
              },
              idx: number
            ) => {
              return (
                <Tr key={idx}>
                  <Td isNumeric>{result.placing}</Td>
                  <Td
                    maxWidth={'12rem'}
                    overflow={'hidden'}
                    textOverflow={'ellipsis'}
                  >
                    {result.name}
                  </Td>
                  <Td>{formatRecord(result.record)}</Td>
                  <Td>{allowEdits ? <DeckInput /> : null}</Td>
                  {/* <Td>
                <SpriteAndNameDisplay
                  archetypeName={result.deck_archetype}
                  pokemonNames={
                    decks?.find(deck => deck.name === result.deck_archetype)
                      ?.defined_pokemon ?? []
                  }
                />
              </Td> */}
                </Tr>
              );
            }
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
