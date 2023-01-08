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
import { StandingsRow } from './StandingsRow';
import { StandingsRowExpandable } from './StandingsRowExpandable';
import { memo } from 'react';

export const StandingsList = memo(({
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
          {results.map((result: Standing, idx: number) =>
            userIsAdmin ? (
              <StandingsRowExpandable
                key={idx}
                result={result}
                tournament={tournament}
                canEditDecks={!result.deck.list}
              />
            ) : (
              <StandingsRow
                key={idx}
                result={result}
                tournament={tournament}
                canEditDecks={false}
              />
            )
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
});

StandingsList.displayName = 'StandingsList';
