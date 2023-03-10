import { Card, Image, Stack, Stat, StatNumber } from '@chakra-ui/react';
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

  return (
    <Card>
      <Stack spacing={0} alignItems={'center'}>
        <Image
          src={getCardImageUrl(card, codeToSetMap)}
          alt={`${card?.name} ${card?.set}`}
        />
        {!hideStat && (
          <Stat padding={2}>
            <StatNumber>
              {count > 2
                ? `${fixPercentage((count * 100) / numberOfDecks)}%`
                : `${count} ran`}
            </StatNumber>
          </Stat>
        )}
      </Stack>
    </Card>
  );
};
