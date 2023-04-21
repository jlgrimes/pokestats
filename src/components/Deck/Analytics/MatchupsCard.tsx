import { useContext, useState } from 'react';
import { Deck, Tournament } from '../../../../types/tournament';
import { DeckTypeSchema } from '../../../hooks/deckArchetypes';
import {
  calculateTieRate,
  calculateWinPercentage,
  getDeckResultsFilters,
  useDeckResults,
} from '../../../hooks/deckResults';
import { DeckCompareColumnType } from '../../common/DeckCompare/DeckCompareSortToggles';
import { DeckCompareTable } from '../../common/DeckCompare/DeckCompareTable';
import { FormatContext } from './DeckAnalyticsContainer';
import { shouldHide } from './MetaGameShare/MetaGameShareList';

interface MatchupsCardProps {
  deck: Deck;
}

export const MatchupsCard = (props: MatchupsCardProps) => {
  const format = useContext(FormatContext);

  const [shouldDrillDown, setShouldDrillDown] = useState(false);
  const [sort, setSort] = useState<{
    sortBy: 'win rate' | 'tie rate';
    sortOrder: 'asc' | 'desc';
  }>({
    sortBy: 'win rate',
    sortOrder: 'desc',
  });
  const filters = getDeckResultsFilters(props.deck, format?.id);
  const { data, isLoading } = useDeckResults(
    filters,
    shouldDrillDown,
    sort.sortBy,
    sort.sortOrder
  );

  const columns: DeckCompareColumnType<'win rate' | 'tie rate'>[] = [
    {
      name: 'win rate',
      label: (deck: DeckTypeSchema) => `${deck.data?.wins} won`,
      calculation: calculateWinPercentage,
      shouldHide: (deck: DeckTypeSchema) => shouldHide(deck, 10),
    },
    {
      name: 'tie rate',
      label: (deck: DeckTypeSchema) => `${deck.data?.ties} tied`,
      calculation: calculateTieRate,
      shouldHide: (deck: DeckTypeSchema) => shouldHide(deck, 10),
    },
  ];

  return (
    <DeckCompareTable
      header={`${props.deck.name} matchups`}
      subheader='Only reflects decks reported through pokestats.live or revealed through deck lists. Tie rates may include intentional draws.'
      decks={data ?? []}
      shouldDrillDown={shouldDrillDown}
      setShouldDrillDown={setShouldDrillDown}
      isLoading={isLoading}
      format={format?.id ?? 1}
      sortBy={sort.sortBy}
      sortOrder={sort.sortOrder}
      setSort={(sortBy: 'win rate' | 'tie rate', sortOrder: 'asc' | 'desc') =>
        setSort({ sortBy, sortOrder })
      }
      columns={columns}
      shouldHideDeck={(deck: DeckTypeSchema) => shouldHide(deck, 10)}
    />
  );

  return <div>in progress</div>;
};
