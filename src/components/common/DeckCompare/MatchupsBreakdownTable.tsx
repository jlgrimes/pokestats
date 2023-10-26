import {
  Box,
} from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';
import { DeckTypeSchema } from '../../../hooks/deckArchetypes';
import { NoDataDisplay } from '../../Deck/Analytics/MetaGameShare/NoDataDisplay';
import { ComponentLoader } from '../ComponentLoader';
import {
  DeckCompareSortTogglesProps,
} from './DeckCompareSortToggles';
import { Flex, Title, Card, Text, Bold, Subtitle, BarList, Color, Icon } from "@tremor/react";
import SpriteDisplay from '../SpriteDisplay/SpriteDisplay';
import { getDeckHref } from './helpers';
import { ScaleIcon } from '@heroicons/react/outline';

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
      const winRate = activeColumn ? Math.round(activeColumn.calculation(deck) * 10000) / 100 : 0;

      return {
        name: deck.name,
        value: winRate,
        href: getDeckHref(deck).pathname,
        icon: () => <SpriteDisplay pokemonNames={deck.defined_pokemon} />,
        color: getBarColor(winRate)
      
    }});

  useEffect(() => {
    if (!props.isLoading && document) {
      document.querySelectorAll('.tremor-BarList-barLink').forEach((el) => {
        el.removeAttribute('target')
      })
    }
  }, [props.isLoading]);

  return (
    <Card>
      <Flex>
        <div>
          <Title>{props.header}</Title>
          <Subtitle>{props.subheader}</Subtitle>
        </div>
        <Icon icon={ScaleIcon} color='neutral' variant="solid" size="sm" />
      </Flex>
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
          <BarList data={data} className='mt-2 [&>div>.tremor-BarList-labelWrapper]:h-10 [&>div>.tremor-BarList-labelWrapper]:after:content-["%"] [&>div>div>div]:items-center [&>div>div>div]:gap-4 [&>div>.tremor-BarList-bar]:h-10' />
      )}
    </Card>
  );
};
