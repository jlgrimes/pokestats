import { Flex, Icon, Stack, Text } from '@chakra-ui/react';
import { FaRunning } from 'react-icons/fa';
import { Standing } from '../../../../../types/tournament';
import { formatRecord } from './helpers';

export const Record = ({ standing }: { standing: Standing }) => {
  if (standing.drop) {
    return (
      <Stack direction='row' color='red.600' spacing={1} alignItems='center'>
        <Text>{formatRecord(standing.record)}</Text>
        <Icon as={FaRunning} />
      </Stack>
    );
  }

  return <Text>{formatRecord(standing.record)}</Text>;
};

Record.displayName = 'Record';
