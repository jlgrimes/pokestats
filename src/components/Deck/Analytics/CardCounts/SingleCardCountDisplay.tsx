import { Card, Image, Stat, StatNumber } from '@chakra-ui/react';
import { DeckCard } from '../../../../../types/tournament';
import { useCodeToSetMap } from '../../../../hooks/deckList';
import { fixPercentage } from '../../ListViewer/CardViewer.tsx/helpers';
import { getCardImageUrl } from '../../ListViewer/helpers';

export const SingleCardCountDisplay = ({
  card,
  count,
  numberOfDecks,
  hideStat,
}: {
  card: DeckCard;
  count: number;
  numberOfDecks: number;
  hideStat?: boolean;
}) => {
  const codeToSetMap = useCodeToSetMap();

  const heightWidthRatio = 1.396;
  const width = 90;
  const height = width * heightWidthRatio;

  return (
    <Card>
      <Image
        width={`${width}px`}
        height={`${height}px`}
        src={getCardImageUrl(card, codeToSetMap)}
        alt={`${card?.name} ${card?.set}`}
      />
      {!hideStat && (
        <Stat>
          <StatNumber>
            {count > 2
              ? `${fixPercentage((count * 100) / numberOfDecks)}%`
              : `${count} ran`}
          </StatNumber>
        </Stat>
      )}
    </Card>
  );
};
