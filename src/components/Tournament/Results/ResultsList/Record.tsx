import { Stack, Text, Link, Heading } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useCallback } from 'react';
import { Standing } from '../../../../../types/tournament';
import { formatRecord, madeDayTwo } from './helpers';

export const Record = ({
  standing,
  tournamentFinished,
  href,
  big,
}: {
  standing: Standing;
  tournamentFinished: boolean;
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
          <Text fontSize='sm' fontFamily={'mono'}>
            {formatRecord(standing.record)}
          </Text>
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

    return (
      <Text fontSize='sm' fontFamily={'mono'}>
        {formatRecord(standing.record)}
      </Text>
    );
  }, [href, standing.record, standing.drop, big]);

  return (
    <Stack
      direction='row'
      color={
        standing.drop
          ? 'red.600'
          : madeDayTwo(standing.record)
          ? 'auto'
          : 'gray.400'
      }
      spacing={1}
      alignItems={big ? 'baseline' : 'center'}
      justifyContent='space-between'
    >
      {renderRecordText()}
    </Stack>
  );
};

Record.displayName = 'Record';
