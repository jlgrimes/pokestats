import { Icon, Stack, Text, Link, Heading, Flex } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useCallback } from 'react';
import { FaLock, FaRegHandPeace, FaRunning } from 'react-icons/fa';
import { Standing } from '../../../../../types/tournament';
import { formatRecord } from './helpers';

export const Record = ({
  standing,
  href,
  big,
}: {
  standing: Standing;
  href?: string;
  big?: boolean;
}) => {
  const renderRecordText = useCallback(() => {
    if (href) {
      return (
        <Link
          as={NextLink}
          color={standing.drop ? 'red.600' : 'blue.600'}
          href={href}
        >
          <Text fontSize='sm'>{formatRecord(standing.record)}</Text>
        </Link>
      );
    }

    if (big) {
      return (
        <Heading color={standing.drop ? 'red.600' : 'gray.700'}>
          {formatRecord(standing.record)}
        </Heading>
      );
    }

    return <Text fontSize='sm'>{formatRecord(standing.record)}</Text>;
  }, [href, standing.record, standing.drop, big]);

  return (
    <Stack
      direction='row'
      color={standing.drop ? 'red.600' : 'auto'}
      spacing={1}
      alignItems={big ? 'baseline' : 'center'}
    >
      {renderRecordText()}
      {standing.drop && <Icon as={FaRunning} />}
      {standing.record.wins * 3 + standing.record.ties >= 19 &&
        !standing.drop && (
          <Icon color='gray.600' boxSize={3} as={FaRegHandPeace} />
        )}
    </Stack>
  );
};

Record.displayName = 'Record';
