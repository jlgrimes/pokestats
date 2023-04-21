import { createContext, memo, useContext, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  HStack,
  Spinner,
  Stack,
  Switch,
  Text,
} from '@chakra-ui/react';
import { useStoredDecks } from '../../../../hooks/finalResults';
import { IndividualShareCard } from './IndividualShareCard';
import { getMetaDiff, getMetaShare } from './helpers';
import { NoDataDisplay } from './NoDataDisplay';
import { CommonCard } from '../../../common/CommonCard';
import { ComponentLoader } from '../../../common/ComponentLoader';
import { useTournaments } from '../../../../hooks/tournaments';
import { Tournament } from '../../../../../types/tournament';
import { FaSortAmountUp } from 'react-icons/fa';
import { MetaGameSortToggles } from './MetaGameSortToggles';
import { DeckCompareTable } from '../../../common/DeckCompare/DeckCompareTable';
import { DeckCompareColumnType } from '../../../common/DeckCompare/DeckCompareSortToggles';
import { getDay2Decks } from '../../../../hooks/stats';
import { getConversionRate } from './ConversionStat';

export const ShouldDrillDownMetaShareContext = createContext(false);

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
        shouldHide: deck => !!(deck.count && deck.count <= 20),
      },
      {
        name: 'converted',
        calculation: deck => getConversionRate(deck, allDecks),
        label: deck => `${getDay2Decks(deck, allDecks)} day two`,
        shouldHide: deck => !!(deck.count && deck.count <= 20),
      },
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
        tournament={tournament}
        sortBy={sort.sortBy}
        sortOrder={sort.sortOrder}
        columns={columns}
        setSort={(sortBy: 'played' | 'converted', sortOrder: 'asc' | 'desc') =>
          setSort({ sortBy, sortOrder })
        }
      />
    );
  }
);

MetaGameShareList.displayName = 'MetaGameDisplayList';
