import { Stat, StatArrow, StatHelpText, StatNumber } from '@chakra-ui/react';
import { memo } from 'react';
import { Deck } from '../../../../../types/tournament';
import { DeckTypeSchema } from '../../../../hooks/deckArchetypes';
import { useStoredDecks } from '../../../../hooks/finalResults';
import { fixPercentage } from '../../ListViewer/CardViewer.tsx/helpers';
import { getMetaDiff, getMetaShare, getNumberOfDecks } from './helpers';

export const ShareStat = memo(
  ({
    deck,
    tournamentRange,
  }: {
    deck: DeckTypeSchema;
    tournamentRange: number[];
  }) => {
    const { data: decks } = useStoredDecks({ tournamentRange });
    const { data: previousDecks } = useStoredDecks({
      tournamentRange: [tournamentRange[0] - 1, tournamentRange[1] - 1],
    });

    const metaShare = getMetaShare(deck, decks);
    if (!metaShare) return null;

    const metaShareDiff = getMetaDiff(deck, decks, previousDecks);

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
