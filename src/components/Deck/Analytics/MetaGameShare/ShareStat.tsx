import { Stat, StatArrow, StatHelpText, StatNumber } from '@chakra-ui/react';
import { memo, useContext } from 'react';
import { DeckTypeSchema } from '../../../../hooks/deckArchetypes';
import { useStoredDecks } from '../../../../hooks/finalResults';
import { fixPercentage } from '../../ListViewer/CardViewer.tsx/helpers';
import { getMetaDiff, getMetaShare } from './helpers';
import { ShouldDrillDownMetaShareContext } from './MetaGameShareList';

export const ShareStat = memo(
  ({ deck, tournamentId }: { deck: DeckTypeSchema; tournamentId: string }) => {
    const shouldDrillDown = useContext(ShouldDrillDownMetaShareContext);
    const { data: decks } = useStoredDecks({
      tournamentId,
      shouldDrillDown,
    });

    const metaShare = getMetaShare(deck, decks);
    if (!metaShare) return null;

    return (
      <Stat>
        <StatNumber>{fixPercentage(metaShare * 100)}%</StatNumber>
      </Stat>
    );
  }
);

ShareStat.displayName = 'ShareStat';
