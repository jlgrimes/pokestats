import { Stack, Text, Link, Heading } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useCallback } from 'react';
import { Standing } from '../../../../../types/tournament';
import { formatRecord, madeDayTwo } from './helpers';

export const Record = ({
  standing,
  href,
  big,
  normal,
}: {
  standing: Standing;
  href?: string;
  big?: boolean;
  normal?: boolean;
}) => {
  const renderRecordText = useCallback(() => {
    if (href) {
      return (
        <Link
          as={NextLink}
          color={standing.drop && standing.drop > 0 ? 'red.600' : 'blue.600'}
          href={href}
        >
          <Text fontSize='md' whiteSpace={'nowrap'}>
            {formatRecord(standing.record)}
          </Text>
        </Link>
      );
    }

    if (big) {
      return (
        <Heading
          color={standing.drop && standing.drop > 0 ? 'red.600' : 'gray.700'}
        >
          {formatRecord(standing.record)}
        </Heading>
      );
    }

    return (
      <Text
        fontSize={normal ? 'lg' : '0.95rem'}
        fontFamily={normal ? 'inherit' : 'mono'}
        whiteSpace={'nowrap'}
      >
        {formatRecord(standing.record)}
      </Text>
    );
  }, [href, standing.record, standing.drop, big, normal]);

  return (
    <Stack
      direction='row'
      color={standing.drop && standing.drop > 0 ? 'red.600' : 'auto'}
      spacing={1}
      alignItems={big ? 'baseline' : 'center'}
      justifyContent='space-between'
    >
      {renderRecordText()}
    </Stack>
  );
};

Record.displayName = 'Record';
