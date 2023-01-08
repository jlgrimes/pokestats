import {
  TableContainer,
  Table,
  Tbody,
  Td,
  Tr,
  Thead,
  Th,
} from '@chakra-ui/react';
import { Standing, Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { formatRecord } from '../../Tournament/Results/ResultsList/helpers';
import { Player } from '../../Tournament/Results/ResultsList/Player/Player';
import { getResultBackgroundColor } from '../helpers';
import { DeckInfoDisplay } from '../../Deck/DeckInfoDisplay';
import { Record } from '../../Tournament/Results/ResultsList/Record';
import { FaChevronDown } from 'react-icons/fa';
import { StandingsRow } from './StandingsRow';

export const StandingsList = ({
  results,
  tournament,
}: {
  results: Standing[];
  tournament: Tournament;
}) => {
  const { data: userIsAdmin } = useUserIsAdmin();

  return (
    <TableContainer>
      <Table size={'sm'}>
        <Thead>
          <Tr>
            <Th></Th>
            <Th padding={0} paddingLeft={2}>
              Name
            </Th>
            <Th padding={0}>Record</Th>
            <Th padding={0} paddingLeft={4}>
              Deck
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {results.map((result: Standing, idx: number) => (
            <StandingsRow
              key={idx}
              result={result}
              tournament={tournament}
              canExpandRow={userIsAdmin}
              canEditDecks={userIsAdmin && !result.deck.list}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
