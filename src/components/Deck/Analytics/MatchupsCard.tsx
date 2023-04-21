import { useContext, useState } from 'react';
import { Deck, Tournament } from '../../../../types/tournament';
import { DeckTypeSchema } from '../../../hooks/deckArchetypes';
import {
  getDeckResultsFilters,
  useDeckResults,
} from '../../../hooks/deckResults';
import { DeckCompareColumnType } from '../../common/DeckCompare/DeckCompareSortToggles';
import { DeckCompareTable } from '../../common/DeckCompare/DeckCompareTable';
import { FormatContext } from './DeckAnalyticsContainer';
import { DeckFinishes } from './DeckFinishes';

interface MatchupsCardProps {
  deck: Deck;
}

export const MatchupsCard = (props: MatchupsCardProps) => {
  const format = useContext(FormatContext);
  const filters = getDeckResultsFilters(props.deck, format?.id);
  const { data, isLoading } = useDeckResults(filters);
  console.log(data);

  const [shouldDrillDown, setShouldDrillDown] = useState(false);
  const [sort, setSort] = useState<{
    sortBy: 'win rate';
    sortOrder: 'asc' | 'desc';
  }>({
    sortBy: 'win rate',
    sortOrder: 'desc',
  });

  const columns: DeckCompareColumnType<'win rate'>[] = [
    {
      name: 'win rate',
      label: (deck: DeckTypeSchema) => `${deck.data?.wins} won`,
      calculation: (deck: DeckTypeSchema) =>
        ((deck.data?.wins ?? 0 * 3) + (deck.data?.ties ?? 0)) /
        (deck.count ?? 1),
      shouldHide: (deck: DeckTypeSchema) =>
        !!(deck.name === 'Other' || (deck.count && deck.count <= 20)),
    },
  ];

  return (
    <DeckCompareTable
      header='Matchups'
      subheader='Cope and seethe Twitter'
      decks={data ?? []}
      shouldDrillDown={shouldDrillDown}
      setShouldDrillDown={setShouldDrillDown}
      isLoading={isLoading}
      format={format?.id ?? 1}
      sortBy={sort.sortBy}
      sortOrder={sort.sortOrder}
      setSort={(sortBy: 'win rate', sortOrder: 'asc' | 'desc') =>
        setSort({ sortBy, sortOrder })
      }
      columns={columns}
    />
  );

  return <div>in progress</div>;
};
