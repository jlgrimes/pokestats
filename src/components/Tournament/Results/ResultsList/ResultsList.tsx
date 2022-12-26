import {
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { ResultsHeader } from './ResultsHeader';
import { ResultsRow } from './ResultsRow';

interface LiveResultType {
  placing: string;
  name: string;
  profile: { id: number; twitterHandle: string };
  record: { wins: number; losses: number; ties: number };
  deck: { name: string; defined_pokemon: string[]; list: Record<string, any> };
  currentMatchResult: string;
}

export default function ResultsList({
  liveResults,
  tournament,
  allowEdits,
  tournamentFinished,
}: {
  liveResults: LiveResultType[];
  tournament: { id: string; name: string };
  allowEdits: boolean;
  tournamentFinished: boolean;
}) {
  return (
    <TableContainer>
      <Table size={'sm'}>
        <ResultsHeader
          view='standings'
        />
        <Tbody>
          {liveResults?.map((result: LiveResultType, idx: number) => {
            return (
              <ResultsRow
                key={idx}
                result={result}
                tournament={tournament}
                allowEdits={allowEdits}
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
