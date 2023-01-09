import { Icon, Stack, Text, Link, Heading, Flex } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useCallback } from 'react';
import {
  FaChessBishop,
  FaChessKing,
  FaChessQueen,
  FaCrown,
  FaHandPeace,
  FaLock,
  FaRegHandPeace,
  FaRunning,
  FaTrash,
} from 'react-icons/fa';
import { Standing } from '../../../../../types/tournament';
import { formatRecord, madeDayTwo } from './helpers';

export const RecordIcon = ({
  standing,
  tournamentFinished,
}: {
  standing: Standing;
  tournamentFinished: boolean;
}) => {
  const commonIconProps = {
    marginRight: '8px',
  };

  const getCrownIcon = useCallback(() => {
    if (!tournamentFinished) {
      return null;
    }

    if (standing.placing === 1) {
      return <Icon {...commonIconProps} as={FaChessKing} color='yellow.500' />;
    }

    if (standing.placing === 2) {
      return <Icon {...commonIconProps} as={FaChessQueen} color='gray.400' />;
    }

    if (standing.placing <= 8) {
      return (
        <Icon {...commonIconProps} as={FaChessBishop} color='yellow.600' />
      );
    }
  }, [tournamentFinished, standing.placing]);

  const showTrashIcon = standing.name === 'Noah Spinale';

  return (
    <>
      {getCrownIcon()}
      {standing.drop && showTrashIcon && (
        <Icon {...commonIconProps} color='red.600' as={FaTrash} />
      )}
      {standing.drop && !showTrashIcon && (
        <Icon {...commonIconProps} color='red.600' as={FaRunning} />
      )}
      {!getCrownIcon() && madeDayTwo(standing.record) && !standing.drop && (
        <Icon
          {...commonIconProps}
          color='gray.500'
          boxSize={3}
          as={FaHandPeace}
        />
      )}
    </>
  );
};
