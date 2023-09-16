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
import { Flex, Title, Card, Text, Bold, Subtitle, BarList, TabGroup, TabList, Tab, Color } from "@tremor/react";
import SpriteDisplay from '../SpriteDisplay/SpriteDisplay';
import { getDeckHref } from './helpers';

export interface MatchupsBreakdownTable<T>
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

export const MatchupsBreakdownTable = <T extends string>(
  props: MatchupsBreakdownTable<T>
) => {
  const getBarColor = useCallback((winRate: number): Color => {
    if (winRate >= 60) return 'green';
    if (winRate >= 52) return 'lime';
    if (winRate >= 48) return 'yellow';
    if (winRate >= 40) return 'orange';

    return 'red';
  }, []);

  const activeColumn = props.columns.find((column) => column.name === props.sortBy);

  const data = props.decks
    .filter(
      deck => !(props.shouldHideDeck && props.shouldHideDeck(deck))
    ).map((deck) => {
      const winRate = activeColumn ? Math.round(activeColumn.calculation(deck, props.decks) * 10000) / 100 : 0;

      return {
        name: deck.name,
        value: winRate,
        href: getDeckHref(deck, props.format).pathname,
        icon: () => <SpriteDisplay pokemonNames={deck.defined_pokemon} />,
        color: getBarColor(winRate)
      
    }})

  return (
    <Card>
      <Title>{props.header}</Title>
      <Subtitle>{props.subheader}</Subtitle>
      <Flex className="mt-6">
        <Text>
          <Bold>Deck archetype</Bold>
        </Text>
        <Text>
          <Bold>Win rate</Bold>
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
