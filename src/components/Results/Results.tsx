import { Flex } from '@chakra-ui/react';
import ResultForm from './ResultForm';
import ResultsList from './ResultsList/ResultsList';

export default function Results({
  tournament,
  allowEdits,
}: {
  tournament: string;
  allowEdits: boolean;
}) {
  return (
    <Flex flexDirection={'column'}>
      {allowEdits && <ResultForm tournament={tournament} />}
      <ResultsList tournament={tournament} />
    </Flex>
  );
}
