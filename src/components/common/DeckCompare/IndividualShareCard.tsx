import { memo, useState } from 'react';
import {
  Box,
  Grid,
  Heading,
  HStack,
  LinkOverlay,
  Stack,
  useColorMode,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import SpriteDisplay from '../../common/SpriteDisplay/SpriteDisplay';
import { CommonCard } from '../CommonCard';
import { DeckTypeSchema } from '../../../hooks/deckArchetypes';
import { DeckCompareColumnType } from './DeckCompareSortToggles';
import { GenericStat } from './GenericStat';
import { getDeckHref } from './helpers';
import { useColor } from '../../../hooks/useColor';

interface IndividualCardProps<T> {
  deck: DeckTypeSchema;
  decks: DeckTypeSchema[];
  columns: DeckCompareColumnType<T>[];
  format: number;
  sortBy: T;
  isComparison?: boolean;
  shouldHideLabels?: boolean;
}

export const IndividualShareCard = memo(
  <T extends string>(props: IndividualCardProps<T>) => {
    const { active, subheader } = useColor();

    return (
      <HStack>
        <CommonCard width='100%'>
          <Grid
            gridTemplateColumns={`auto repeat(${props.columns.length}, ${
              props.shouldHideLabels ? 3.5 : 5
            }rem)`}
            paddingX={2}
            gap={2}
            alignItems='center'
          >
            <Grid
              gridTemplateColumns={`${
                props.isComparison ? '1.5rem' : ''
              } 5.2rem auto`}
              alignItems='center'
            >
              {props.isComparison && (
                <Heading
                  color={subheader}
                  fontSize={12}
                  textTransform='uppercase'
                >
                  vs
                </Heading>
              )}
              <SpriteDisplay pokemonNames={props.deck.defined_pokemon} />
              <LinkOverlay
                as={NextLink}
                href={getDeckHref(props.deck, props.format) as any}
              >
                <Heading color={active} size={'sm'}>
                  {props.deck.name}
                </Heading>
              </LinkOverlay>
            </Grid>
            {props.columns.map(column => (
              <GenericStat
                key={`${props.deck}-${column.name}`}
                deck={props.deck}
                decks={props.decks}
                column={column}
                isInactive={props.sortBy !== column.name}
                shouldHideLabel={props.shouldHideLabels}
              />
            ))}
          </Grid>
        </CommonCard>
      </HStack>
    );
  }
);

IndividualShareCard.displayName = 'IndividualShareCard';
