import { Icon } from '@chakra-ui/react';
import { useCallback, useMemo } from 'react';
import {
  FaChessBishop,
  FaChessKing,
  FaChessQueen,
  FaChessRook,
  FaHandPeace,
  FaRunning,
  FaTrash,
  FaUserAltSlash,
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
  const commonIconProps = useMemo(
    () => ({
      marginRight: '8px',
    }),
    []
  );

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
      return <Icon {...commonIconProps} as={FaChessRook} color='yellow.600' />;
    }

    if (standing.placing <= 8) {
      return (
        <Icon {...commonIconProps} as={FaChessBishop} color='yellow.600' />
      );
    }

    return null;
  }, [tournamentFinished, standing.placing, commonIconProps]);

  const getIcon = useCallback(() => {
    const showTrashIcon = standing.name === 'Noah Spinale';

    if (getCrownIcon()) {
      return getCrownIcon();
    }

    if (standing.drop) {
      if (standing.placing === 9999) {
        return <Icon {...commonIconProps} color='red.600' as={FaUserAltSlash} />
      }

      if (showTrashIcon) {
        return <Icon {...commonIconProps} color='red.600' as={FaTrash} />;
      }

      return <Icon {...commonIconProps} color='red.600' as={FaRunning} />;
    }

    if (madeDayTwo(standing.record)) {
      return (
        <Icon
          {...commonIconProps}
          color='gray.500'
          boxSize={3}
          as={FaHandPeace}
        />
      );
    }

    return null;
  }, [commonIconProps, getCrownIcon, standing]);

  return getIcon();
};
