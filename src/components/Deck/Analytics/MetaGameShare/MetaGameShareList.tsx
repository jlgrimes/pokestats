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
import { getMetaDiff } from './helpers';
import { NoDataDisplay } from './NoDataDisplay';
import { CommonCard } from '../../../common/CommonCard';
import { ComponentLoader } from '../../../common/ComponentLoader';
import { useTournaments } from '../../../../hooks/tournaments';
import { Tournament } from '../../../../../types/tournament';
import { FaSortAmountUp } from 'react-icons/fa';
import { MetaGameSortToggles } from './MetaGameSortToggles';

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
      isLoading,
      numberReported,
    } = useStoredDecks({
      tournamentId: tournament.id,
      shouldDrillDown,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
    });

    return (
      <ShouldDrillDownMetaShareContext.Provider value={shouldDrillDown}>
        <CommonCard
          header={tournament.name ? `${tournament.name} Decks` : `Decks`}
          subheader={`${tournament.players.masters} Masters, ${numberReported} known`}
          {...(shouldHideSlug
            ? {}
            : {
                slug: `/decks?tournament=${tournament.id}`,
              })}
          ghost
        >
          <Stack>
            <Grid gridTemplateColumns='1.1fr 1fr 1fr' paddingX={3}>
              <HStack padding={2}>
                <Text color='gray.500' fontWeight='semibold' fontSize='sm'>
                  Drilldown
                </Text>
                <Switch
                  isChecked={shouldDrillDown}
                  onChange={() => setShouldDrillDown(!shouldDrillDown)}
                />
              </HStack>
              <MetaGameSortToggles
                sortBy={sort.sortBy}
                sortOrder={sort.sortOrder}
                setSort={(sortBy, sortOrder) => setSort({ sortBy, sortOrder })}
              />
            </Grid>
            {isLoading ? (
              <Box height={'50rem'}>
                <ComponentLoader />
              </Box>
            ) : decks.length === 0 ? (
              <NoDataDisplay />
            ) : (
              <Grid gridTemplateColumns={'1fr 1fr'} gap={2} rowGap={2}>
                {decks
                  .slice(0, preview ? 4 : undefined)
                  .map(({ deck, count }) => {
                    return (
                      deck?.id && (
                        <IndividualShareCard
                          key={`${deck.name}${deck.id}`}
                          deck={deck}
                          count={count}
                          tournament={tournament}
                        />
                      )
                    );
                  })}
              </Grid>
            )}
          </Stack>
        </CommonCard>
      </ShouldDrillDownMetaShareContext.Provider>
    );
  }
);

MetaGameShareList.displayName = 'MetaGameDisplayList';
