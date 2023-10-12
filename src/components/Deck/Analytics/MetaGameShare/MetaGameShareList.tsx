import { createContext, memo, useContext, useMemo, useState } from 'react';
import { useStoredDecks } from '../../../../hooks/finalResults';
import { getMetaShare } from './helpers';
import { Tournament } from '../../../../../types/tournament';
import { DeckCompareColumnType } from '../../../common/DeckCompare/DeckCompareSortToggles';
import { getDay2Decks, getConversionRate } from '../../../../hooks/stats';
import { DeckTypeSchema } from '../../../../hooks/deckArchetypes';
import { MetagameBreakdownTable } from '../../../common/DeckCompare/MetagameBreakdownTable';
import { useMetaShare } from '../../../../hooks/finalResults/useStoredDecks';

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
      sortBy: 'played' | 'day 2';
      sortOrder: 'asc' | 'desc';
    }>({
      sortBy: 'played',
      sortOrder: 'desc',
    });

    // TODO ONCE SENIORS + JUNIORS USE - ADD AGE DIVISION VAR
    const {
      data: metaShare,
      isLoading
    } = useMetaShare(tournament.id, 'masters');

    const columns: DeckCompareColumnType<'played' | 'day 2'>[] = [
      {
        name: 'played',
        calculation: (deck, decks) => getMetaShare(deck, decks),
        label: deck => `${deck.count} played`,
        shouldHide: (deck: DeckTypeSchema) => shouldHide(deck),
      },
      ...(!tournament.name.includes(' Cup')
        ? [
            {
              name: 'day 2' as 'played' | 'day 2',
              calculation: (deck: DeckTypeSchema) => (deck.count && deck.day_two_count) ? (deck.day_two_count / deck.count) : 0,
              label: (deck: DeckTypeSchema) =>
                `boop day two`,
              shouldHide: (deck: DeckTypeSchema) => shouldHide(deck),
            },
          ]
        : []),
    ];

    const numKnown = metaShare?.reduce((acc, share) => acc + (share.count ?? 0), 0) ?? 0;

    return (
      <MetagameBreakdownTable
        tournament={tournament}
        numKnown={numKnown}
        decks={metaShare ?? []}
        shouldDrillDown={shouldDrillDown}
        setShouldDrillDown={setShouldDrillDown}
        isLoading={isLoading}
        format={tournament.format.id}
        sortBy={sort.sortBy}
        sortOrder={sort.sortOrder}
        columns={columns}
        setSort={(sortBy: 'played' | 'day 2', sortOrder: 'asc' | 'desc') =>
          setSort({ sortBy, sortOrder })
        }
        shouldHideDeck={deck => shouldHide(deck)}
      />
    );
  }
);

MetaGameShareList.displayName = 'MetaGameDisplayList';
