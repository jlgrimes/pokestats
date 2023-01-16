import { Stat, StatArrow, StatHelpText, StatNumber } from '@chakra-ui/react';
import { memo } from 'react';
import { Deck } from '../../../../../types/tournament';
import { useStoredDecks } from '../../../../hooks/finalResults';
import { fixPercentage } from '../../ListViewer/CardViewer.tsx/helpers';
import { getNumberOfDecks } from './helpers';

export const ShareStat = memo(
  ({ deck, tournamentRange }: { deck: Deck, tournamentRange: number[] }) => {
    const decks = useStoredDecks({ tournamentRange });
    const previousDecks = useStoredDecks({
      tournamentRange: [tournamentRange[0] - 1, tournamentRange[1] - 1],
    });

    const metaDeck =
    tournamentRange[0] === tournamentRange[1]
      ? decks.find(
          ({ deck: currDeck }) => currDeck.id === deck.id
        )
      : null;

    if (!metaDeck) return null;

    const metaShare = metaDeck.count / getNumberOfDecks(decks);

    const previousMetaDeck =
      tournamentRange[0] === tournamentRange[1]
        ? previousDecks.find(
            ({ deck: previousDeck }) => previousDeck.id === deck.id
          )
        : null;

    const previousMetaShare =
      (previousMetaDeck?.count ?? 0) /
      (previousDecks.length > 0 ? getNumberOfDecks(previousDecks) : 1);
    const metaShareDiff =
      previousMetaShare === 0 ? 1 : metaShare - previousMetaShare;

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
