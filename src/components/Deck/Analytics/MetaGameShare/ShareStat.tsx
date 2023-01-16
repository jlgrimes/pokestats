import { Stat, StatArrow, StatHelpText, StatNumber } from '@chakra-ui/react';
import { memo } from 'react';
import { fixPercentage } from '../../ListViewer/CardViewer.tsx/helpers';

export const ShareStat = memo(
  ({
    metaShare,
    metaShareDiff,
  }: {
    metaShare: number;
    metaShareDiff?: number;
  }) => {
    return (
      <Stat>
        <StatNumber>{fixPercentage(metaShare * 100)}%</StatNumber>
        {metaShareDiff && (
          <StatHelpText>
            <StatArrow type={metaShareDiff >= 0 ? 'increase' : 'decrease'} />
            {fixPercentage(metaShareDiff * 100)}%
          </StatHelpText>
        )}
      </Stat>
    );
  }
);

ShareStat.displayName = 'ShareStat';
