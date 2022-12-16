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
import { getResultQueryKey } from '../../../lib/fetch/query-keys';
import supabase from '../../../lib/supabase/client';

export default function ResultsList() {
  const tournamentName = 'Toronto 2022';
  const fetchResults = async () => {
    const res = await supabase
      .from('Tournament Results')
      .select('*')
      .eq('tournament_name', tournamentName);
    return res.data;
  };
  const { data: results } = useQuery(
    getResultQueryKey(tournamentName),
    fetchResults
  );

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
              <Td>{result.deck_archetype}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
