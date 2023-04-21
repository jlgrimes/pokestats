import { Box, Grid, HStack, Stack, Switch, Text } from '@chakra-ui/react';
import { createContext, useState } from 'react';
import { Tournament } from '../../../../types/tournament';
import { DeckTypeSchema } from '../../../hooks/deckArchetypes';
import { NoDataDisplay } from '../../Deck/Analytics/MetaGameShare/NoDataDisplay';
import { CommonCard } from '../CommonCard';
import { ComponentLoader } from '../ComponentLoader';
import {
  DeckCompareSortToggles,
  DeckCompareSortTogglesProps,
} from './DeckCompareSortToggles';
import { IndividualShareCard } from './IndividualShareCard';

export interface DeckCompareTableProps<T>
  extends DeckCompareSortTogglesProps<T> {
  header: string;
  subheader: string;
  slug?: string;
  decks: DeckTypeSchema[];
  shouldDrillDown: boolean;
  setShouldDrillDown: (shouldDrillDown: boolean) => void;
  isLoading: boolean;
  tournament: Tournament;
}

export const ShouldDrillDownMetaShareContext = createContext(false);

export const DeckCompareTable = <T extends string>(
  props: DeckCompareTableProps<T>
) => {
  return (
    <ShouldDrillDownMetaShareContext.Provider value={props.shouldDrillDown}>
      <CommonCard
        header={props.header}
        subheader={props.subheader}
        slug={props.slug}
        ghost
      >
        <Stack>
          <Grid
            gridTemplateColumns={`auto repeat(7em, ${props.columns.length})`}
            paddingX={3}
          >
            <HStack>
              <Text color='gray.500' fontWeight='semibold' fontSize='sm'>
                Drilldown
              </Text>
              <Switch
                isChecked={props.shouldDrillDown}
                onChange={() =>
                  props.setShouldDrillDown(!props.shouldDrillDown)
                }
              />
            </HStack>
            <DeckCompareSortToggles
              sortBy={props.sortBy}
              sortOrder={props.sortOrder}
              columns={props.columns}
              setSort={props.setSort}
            />
          </Grid>
          {props.isLoading ? (
            <Box height={'50rem'}>
              <ComponentLoader />
            </Box>
          ) : props.decks.length === 0 ? (
            <NoDataDisplay />
          ) : (
            <Grid gridTemplateColumns={'1fr 1fr'} gap={2} rowGap={2}>
              {props.decks.map(deck => {
                return (
                  deck?.id && (
                    <IndividualShareCard
                      key={`${deck.name}${deck.id}`}
                      decks={props.decks}
                      deck={deck}
                      columns={props.columns}
                      tournament={props.tournament}
                      sortBy={props.sortBy}
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
};
