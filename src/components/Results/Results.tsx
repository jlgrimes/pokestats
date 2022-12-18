import { Flex } from '@chakra-ui/react';
import ResultForm from './ResultForm';
import ResultsList from './ResultsList/ResultsList';

export default function Results({
  tournament,
  allowEdits,
}: {
  tournament: { id: string, name: string };
  allowEdits: boolean;
}) {
  return (
    <Flex flexDirection={'column'}>
      {allowEdits && <ResultForm tournament={tournament.name} />}
      <ResultsList tournament={tournament} />
    </Flex>
  );
}
