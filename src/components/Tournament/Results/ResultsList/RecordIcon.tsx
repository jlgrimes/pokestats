import { Icon } from '@chakra-ui/react';
import { useCallback } from 'react';
import {
  FaChessBishop,
  FaChessKing,
  FaChessQueen,
  FaChessRook,
  FaHandPeace,
  FaRunning,
  FaTrash,
} from 'react-icons/fa';
import { Standing } from '../../../../../types/tournament';
import { madeDayTwo } from './helpers';

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

    if (standing.placing <= 4) {
      return (
        <Icon {...commonIconProps} as={FaChessRook} color='yellow.600' />
      );
    }

    if (standing.placing <= 8) {
      return (
        <Icon {...commonIconProps} as={FaChessBishop} color='yellow.600' />
      );
    }
  }, [tournamentFinished, standing.placing, commonIconProps]);

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
