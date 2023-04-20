import { Box, Button, Grid, useColorMode } from '@chakra-ui/react';
import { Fragment } from 'react';
import {
  FaSortAmountDown,
  FaSortAmountDownAlt,
  FaSortAmountUp,
} from 'react-icons/fa';

interface MetaGameSortTogglesProps {
  sortBy: 'played' | 'converted';
  sortOrder: 'asc' | 'desc';
  setSort: (sortBy: 'played' | 'converted', sortOrder: 'asc' | 'desc') => void;
}

export const MetaGameSortToggles = (props: MetaGameSortTogglesProps) => {
  const { colorMode } = useColorMode();
  const activeColor = 'black';
  const inactiveColor = colorMode === 'dark' ? 'gray.600' : 'gray.400';

  const invertOrder = (order: 'asc' | 'desc') =>
    order === 'asc' ? 'desc' : 'asc';

  return (
    <Fragment>
      <Button
        color={props.sortBy === 'played' ? activeColor : inactiveColor}
        size='sm'
        variant='ghost'
        leftIcon={
          props.sortBy === 'played' && props.sortOrder === 'asc' ? (
            <FaSortAmountDownAlt />
          ) : (
            <FaSortAmountUp />
          )
        }
        onClick={() => {
          if (props.sortBy === 'played') {
            props.setSort('played', invertOrder(props.sortOrder));
          } else {
            props.setSort('played', 'desc');
          }
        }}
      >
        Played
      </Button>
      <Button
        color={props.sortBy === 'converted' ? activeColor : inactiveColor}
        size='sm'
        variant='ghost'
        leftIcon={
          props.sortBy === 'converted' && props.sortOrder === 'asc' ? (
            <FaSortAmountDownAlt />
          ) : (
            <FaSortAmountUp />
          )
        }
        onClick={() => {
          if (props.sortBy === 'converted') {
            props.setSort('converted', invertOrder(props.sortOrder));
          } else {
            props.setSort('converted', 'desc');
          }
        }}
      >
        Converted
      </Button>
    </Fragment>
  );
};
