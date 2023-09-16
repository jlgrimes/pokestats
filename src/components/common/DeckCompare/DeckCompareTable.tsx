import {
  Box,
  Button,
  Grid,
  HStack,
  Stack,
  Switch,
} from '@chakra-ui/react';
import { createContext, useState } from 'react';
import { FaChess, FaChessRook } from 'react-icons/fa';
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
import { Flex, Title, Card, Text, Bold, Subtitle, BarList  } from "@tremor/react";
import SpriteDisplay from '../SpriteDisplay/SpriteDisplay';
import { getDeckHref } from './helpers';

export interface DeckCompareTableProps<T>
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

export const DeckCompareTable = <T extends string>(
  props: DeckCompareTableProps<T>
) => {
  const [shouldHideLabels] = useState(true);

  const data = props.decks
    .filter(
      deck => !(props.shouldHideDeck && props.shouldHideDeck(deck))
    ).map((deck) => ({
      name: deck.name,
      value: Math.round(props.columns[0].calculation(deck, props.decks) * 10000) / 100,
      href: getDeckHref(deck, props.format).pathname,
      icon: () => <SpriteDisplay pokemonNames={deck.defined_pokemon} />
    }))

  return (
    <ShouldDrillDownMetaShareContext.Provider value={props.shouldDrillDown}>
      <Card>
        <Title>{props.header}</Title>
        <Subtitle>{props.subheader}</Subtitle>
        <Flex className="mt-4">
          <Text>
            <Bold>Deck Archetype</Bold>
          </Text>
          <Text>
            <Bold>Day 1 Usage</Bold>
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
    </ShouldDrillDownMetaShareContext.Provider>
  );
};
