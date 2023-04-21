import { createContext, memo, useContext, useMemo, useState } from 'react';
import { useStoredDecks } from '../../../../hooks/finalResults';
import { getMetaShare } from './helpers';
import { Tournament } from '../../../../../types/tournament';
import { DeckCompareTable } from '../../../common/DeckCompare/DeckCompareTable';
import { DeckCompareColumnType } from '../../../common/DeckCompare/DeckCompareSortToggles';
import { getDay2Decks, getConversionRate } from '../../../../hooks/stats';
import { DeckTypeSchema } from '../../../../hooks/deckArchetypes';

export const ShouldDrillDownMetaShareContext = createContext(false);

export const shouldHide = (deck: DeckTypeSchema, num?: number) =>
  !!(deck.count && deck.count <= (num ?? 20)) || deck.name === 'Other';

export const MetaGameShareList = memo(
  ({
    sortByMoves,
    preview,
    shouldHideSlug,
    tournament,
  }: {
    tournament: Tournament;
    sortByMoves?: boolean;
    preview?: boolean;
    shouldHideSlug?: boolean;
  }) => {
    const [shouldDrillDown, setShouldDrillDown] = useState(false);
    const [sort, setSort] = useState<{
      sortBy: 'played' | 'converted';
      sortOrder: 'asc' | 'desc';
    }>({
      sortBy: 'played',
      sortOrder: 'desc',
    });

    const {
      data: decks,
      decks: allDecks,
      isLoading,
      numberReported,
    } = useStoredDecks({
      tournamentId: tournament.id,
      shouldDrillDown,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
    });

    const columns: DeckCompareColumnType<'played' | 'converted'>[] = [
      {
        name: 'played',
        calculation: (deck, decks) => getMetaShare(deck, decks),
        label: deck => `${deck.count} played`,
        shouldHide: (deck: DeckTypeSchema) => shouldHide(deck),
      },
      ...(!tournament.name.includes(' Cup')
        ? [
            {
              name: 'converted' as 'played' | 'converted',
              calculation: (deck: DeckTypeSchema) =>
                getConversionRate(deck, allDecks),
              label: (deck: DeckTypeSchema) =>
                `${getDay2Decks(deck, allDecks)} day two`,
              shouldHide: (deck: DeckTypeSchema) => shouldHide(deck),
            },
          ]
        : []),
    ];

    return (
      <DeckCompareTable
        header={tournament.name ? `${tournament.name} Decks` : `Decks`}
        subheader={`${tournament.players.masters} Masters, ${numberReported} known`}
        slug={shouldHideSlug ? `/decks?tournament=${tournament.id}` : undefined}
        decks={decks}
        shouldDrillDown={shouldDrillDown}
        setShouldDrillDown={setShouldDrillDown}
        isLoading={isLoading}
        format={tournament.format.id}
        sortBy={sort.sortBy}
        sortOrder={sort.sortOrder}
        columns={columns}
        setSort={(sortBy: 'played' | 'converted', sortOrder: 'asc' | 'desc') =>
          setSort({ sortBy, sortOrder })
        }
        shouldHideDeck={deck => shouldHide(deck)}
      />
    );
  }
);

MetaGameShareList.displayName = 'MetaGameDisplayList';
