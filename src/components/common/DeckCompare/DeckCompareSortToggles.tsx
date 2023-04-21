import { Button, useColorMode } from '@chakra-ui/react';
import { Fragment } from 'react';
import { FaSortAmountDownAlt, FaSortAmountUp } from 'react-icons/fa';
import { DeckTypeSchema } from '../../../hooks/deckArchetypes';

export type DeckCompareColumnType<T> = {
  name: T;
  label: (value: number) => string;
  shouldHide: (value: number) => boolean;
  calculation: (deck: DeckTypeSchema, decks: DeckTypeSchema[]) => number;
};

export interface DeckCompareSortTogglesProps<T> {
  sortBy: T;
  sortOrder: 'asc' | 'desc';
  columns: DeckCompareColumnType<T>[];
  setSort: (sortBy: T, sortOrder: 'asc' | 'desc') => void;
}

export const DeckCompareSortToggles = <T extends string>(
  props: DeckCompareSortTogglesProps<T>
) => {
  const { colorMode } = useColorMode();
  const activeColor = colorMode === 'dark' ? 'gray.100' : 'gray.900';
  const inactiveColor = colorMode === 'dark' ? 'gray.600' : 'gray.400';

  const invertOrder = (order: 'asc' | 'desc') =>
    order === 'asc' ? 'desc' : 'asc';

  return (
    <Fragment>
      {props.columns.map(column => (
        <Button
          key={`column-toggle-${column}`}
          color={props.sortBy === column.name ? activeColor : inactiveColor}
          size='sm'
          variant='ghost'
          leftIcon={
            props.sortBy === column.name && props.sortOrder === 'asc' ? (
              <FaSortAmountDownAlt />
            ) : (
              <FaSortAmountUp />
            )
          }
          onClick={() => {
            if (props.sortBy === column.name) {
              props.setSort(column.name, invertOrder(props.sortOrder));
            } else {
              props.setSort(column.name, 'desc');
            }
          }}
        >
          {column.name}
        </Button>
      ))}
    </Fragment>
  );
};
