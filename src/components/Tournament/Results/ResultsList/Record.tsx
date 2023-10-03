import { Link, useColorMode } from '@chakra-ui/react';
import { Bold, Text, Title } from '@tremor/react';
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
  const { colorMode } = useColorMode();

  const renderRecordText = useCallback(() => {
    if (href) {
      return (
        <Link
          as={NextLink}
          color={standing.drop && standing.drop > 0 ? 'red.600' : 'blue.600'}
          href={href}
        >
          <Text>
            {formatRecord(standing.record)}
          </Text>
        </Link>
      );
    }

    if (big) {
      return (
        <Title
          className={standing.drop && standing.drop > 0 ? 'text-red-600' : ''}
        >
          {formatRecord(standing.record)}
        </Title>
      );
    }

    return (
      <Bold>
        {formatRecord(standing.record)}
      </Bold>
    );
  }, [href, standing.record, standing.drop, big, normal]);

  return renderRecordText();
};

Record.displayName = 'Record';
