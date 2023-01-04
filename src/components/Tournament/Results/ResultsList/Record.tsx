import { Icon, Stack, Text, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useCallback } from 'react';
import { FaRunning } from 'react-icons/fa';
import { Standing } from '../../../../../types/tournament';
import { formatRecord } from './helpers';

export const Record = ({
  standing,
  href,
}: {
  standing: Standing;
  href?: string;
}) => {
  const renderRecordText = useCallback(() => {
    if (href) {
      return (
        <Link as={NextLink} color={standing.drop ? 'red.600' : 'blue.600'} href={href}>
          <Text>{formatRecord(standing.record)}</Text>
        </Link>
      );
    }
    return <Text>{formatRecord(standing.record)}</Text>;
  }, [href, standing.record]);

  if (standing.drop) {
    return (
      <Stack direction='row' color='red.600' spacing={1} alignItems='center'>
        {renderRecordText()}
        <Icon as={FaRunning} />
      </Stack>
    );
  }

  return renderRecordText();
};

Record.displayName = 'Record';
