import { Button, useColorMode } from '@chakra-ui/react';
import { Fragment } from 'react';
import { FaSortAmountDown, FaSortAmountUpAlt } from 'react-icons/fa';
import { DeckTypeSchema } from '../../../hooks/deckArchetypes';
import { useColor } from '../../../hooks/useColor';

export type DeckCompareColumnType<T> = {
  name: T;
  label: (deck: DeckTypeSchema, decks: DeckTypeSchema[]) => string;
  shouldHide: (deck: DeckTypeSchema, decks: DeckTypeSchema[]) => boolean;
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
  const { active, inactive } = useColor();

  const invertOrder = (order: 'asc' | 'desc') =>
    order === 'asc' ? 'desc' : 'asc';

  return (
    <Fragment>
      {props.columns.map(column => (
        <Button
          key={`column-toggle-${column.name}`}
          color={props.sortBy === column.name ? active : inactive}
          size='sm'
          variant='ghost'
          leftIcon={
            props.sortBy === column.name && props.sortOrder === 'asc' ? (
              <FaSortAmountUpAlt />
            ) : (
              <FaSortAmountDown />
            )
          }
          onClick={() => {
            if (props.sortBy === column.name) {
              props.setSort(column.name, invertOrder(props.sortOrder));
            } else {
              props.setSort(column.name, 'desc');
            }
          }}
          _active={{ backgroundColor: 'transparent' }}
          _hover={{ backgroundColor: 'transparent' }}
        >
          {column.name}
        </Button>
      ))}
    </Fragment>
  );
};
