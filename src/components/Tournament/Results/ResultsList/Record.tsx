import { Icon, Stack, Text, Link, Heading, Flex } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useCallback } from 'react';
import {
  FaCrown,
  FaHandPeace,
  FaLock,
  FaRegHandPeace,
  FaRunning,
  FaTrash,
} from 'react-icons/fa';
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

  const getCrownIcon = useCallback(() => {
    if (!tournamentFinished) {
      return null;
    }
    console.log(standing)

    if (standing.placing === 1) {
      return <Icon as={FaCrown} color='yellow.500'/>;
    }

    if (standing.placing === 2) {
      return <Icon as={FaCrown} color='gray.500' />;
    }

    if (standing.placing <= 8) {
      return <Icon as={FaCrown} color='yellow.700' />;
    }
  }, [tournamentFinished, standing.placing]);

  const showTrashIcon = standing.name === 'Noah Spinale';

  return (
    <Stack
      direction='row'
      color={
        standing.drop || madeDayTwo(standing.record) === false
          ? 'gray.400'
          : 'auto'
      }
      spacing={1}
      alignItems={big ? 'baseline' : 'center'}
      justifyContent='space-between'
    >
      {renderRecordText()}
      {getCrownIcon()}
      {standing.drop && showTrashIcon && <Icon as={FaTrash} />}
      {standing.drop && !showTrashIcon && <Icon as={FaRunning} />}
      {!getCrownIcon() && madeDayTwo(standing.record) && !standing.drop && (
        <Icon color='gray.500' boxSize={3} as={FaHandPeace} />
      )}
    </Stack>
  );
};

Record.displayName = 'Record';
