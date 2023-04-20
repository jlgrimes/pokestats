import { memo, useContext } from 'react';
import { DeckTypeSchema } from '../../../../hooks/deckArchetypes';
import { useStoredDecks } from '../../../../hooks/finalResults';
import { Stat } from '../../../common/Stat';
import { getMetaShare } from './helpers';
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

    return <Stat stat={metaShare} label={`${deck.count} played`} />;
  }
);

ShareStat.displayName = 'ShareStat';
