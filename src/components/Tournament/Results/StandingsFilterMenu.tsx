import {
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  StackItem,
} from '@chakra-ui/react';
import { memo } from 'react';
import { FaFilter } from 'react-icons/fa';

export interface Filter {
  name: string;
  value: boolean;
}

export interface StandingsFilters {
  day1: Filter;
}

export const StandingsFilterMenu = memo(({
  filters,
  toggleFilter,
}: {
  filters: StandingsFilters;
  toggleFilter: (key: keyof StandingsFilters) => void;
}) => {
  return (
    <StackItem paddingLeft={6}>
      <Menu closeOnSelect={false}>
        <MenuButton
          as={Button}
          colorScheme='gray'
          variant='outline'
          size='sm'
          leftIcon={<FaFilter />}
        >
          Filter
        </MenuButton>
        <MenuList minWidth='240px'>
          <MenuItemOption value='day1' isChecked={filters.day1.value} onClick={() => toggleFilter('day1')}>
            Include day 1
          </MenuItemOption>
        </MenuList>
      </Menu>
    </StackItem>
  );
});

StandingsFilterMenu.displayName = 'StandingsFilterMenu';
