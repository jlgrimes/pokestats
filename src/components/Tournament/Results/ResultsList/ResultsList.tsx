import {
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { Standing } from '../../../../../types/tournament';
import { useUserIsAdmin } from '../../../../hooks/administrators';
import { ResultsHeader } from './ResultsHeader';
import { ResultsRow } from './ResultsRow';

export default function ResultsList({
  liveResults,
  tournament,
  tournamentFinished,
}: {
  liveResults: Standing[];
  tournament: { id: string; name: string };
  tournamentFinished: boolean;
}) {
  const userIsAdmin = useUserIsAdmin();

  return (
    <TableContainer>
      <Table size={'sm'}>
        <ResultsHeader
          view='standings'
        />
        <Tbody>
          {liveResults?.map((result: Standing, idx: number) => {
            return (
              <ResultsRow
                key={idx}
                result={result}
                tournament={tournament}
                allowEdits={{
                  deck: userIsAdmin,
                  player: userIsAdmin
                }}
                tournamentFinished={tournamentFinished}
                view='standings'
              />
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
