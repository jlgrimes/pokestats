import {
  Box,
} from '@chakra-ui/react';
import { createContext, memo, useCallback, useState } from 'react';
import { FaChess, FaChessRook } from 'react-icons/fa';
import { Tournament } from '../../../../types/tournament';
import { DeckTypeSchema } from '../../../hooks/deckArchetypes';
import { NoDataDisplay } from '../../Deck/Analytics/MetaGameShare/NoDataDisplay';
import { CommonCard } from '../CommonCard';
import { ComponentLoader } from '../ComponentLoader';
import {
  DeckCompareColumnType,
  DeckCompareSortToggles,
  DeckCompareSortTogglesProps,
} from './DeckCompareSortToggles';
import { IndividualShareCard } from './IndividualShareCard';
import { Flex, Title, Card, Text, Bold, Subtitle, BarList, TabGroup, TabList, Tab } from "@tremor/react";
import SpriteDisplay from '../SpriteDisplay/SpriteDisplay';
import { getDeckHref } from './helpers';

export interface MetagameBreakdownTableProps<T>
  extends DeckCompareSortTogglesProps<T> {
  header: string;
  subheader: string;
  slug?: string;
  decks: DeckTypeSchema[];
  shouldDrillDown: boolean;
  setShouldDrillDown: (shouldDrillDown: boolean) => void;
  isLoading: boolean;
  format: number;
  shouldHideDeck?: (deck: DeckTypeSchema) => boolean;
  isComparison?: boolean;
}

export const ShouldDrillDownMetaShareContext = createContext(false);

export const MetagameBreakdownTable = <T extends string>(
  props: MetagameBreakdownTableProps<T>
) => {
  const getValueDisplayLabel = useCallback((column: DeckCompareColumnType<T> | undefined) => {
    if (column?.name === 'played') {
      return 'Usage';
    }

    if (column?.name === 'day 2') {
      return 'Conversion rate';
    }

    return 'value';
  }, []);

  const activeColumn = props.columns.find((column) => column.name === props.sortBy);

  const data = props.decks
    .filter(
      deck => !(props.shouldHideDeck && props.shouldHideDeck(deck))
    ).map((deck) => ({
      name: deck.name,
      value: activeColumn ? Math.round(activeColumn.calculation(deck, props.decks) * 10000) / 100 : 0,
      href: getDeckHref(deck, props.format).pathname,
      icon: () => <SpriteDisplay pokemonNames={deck.defined_pokemon} />
    }))

  return (
    <Card>
      <Title>{props.header}</Title>
      <Subtitle>{props.subheader}</Subtitle>
      <TabGroup className='mt-4' onIndexChange={((index) => props.setSort(props.columns[index].name, 'desc'))}>
        <TabList>
          <Tab>Day 1 usage</Tab>
          <Tab>Day 2 conversion</Tab>
        </TabList>
      </TabGroup>
      <Flex className="mt-6">
        <Text>
          <Bold>Deck archetype</Bold>
        </Text>
        <Text>
          <Bold>{getValueDisplayLabel(activeColumn)}</Bold>
        </Text>
      </Flex>
      {props.isLoading ? (
        <Box height={'50rem'}>
          <ComponentLoader />
        </Box>
      ) : props.decks.length === 0 ? (
        <NoDataDisplay />
      ) : (
          <BarList data={data} className='mt-2 [&>div>.tremor-BarList-labelWrapper]:h-12 [&>div>.tremor-BarList-labelWrapper]:after:content-["%"] [&>div>div>div]:items-center [&>div>div>div]:gap-4 [&>div>.tremor-BarList-bar]:h-12' />
      )}
    </Card>
  );
};
