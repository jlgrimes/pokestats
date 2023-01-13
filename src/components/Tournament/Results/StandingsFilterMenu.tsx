import {
  Button,
  Grid,
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
import { Tournament } from '../../../../types/tournament';
import { useMostPopularArchetypes } from '../../../hooks/deckArchetypes';
import SpriteDisplay from '../../common/SpriteDisplay';

export interface Filter {
  name: string;
  value: boolean;
}

export interface StandingsFilters {
  day1: Filter;
  decksVisible: number[];
}

export const StandingsFilterMenu = memo(
  ({
    getFilter,
    toggleFilter,
    tournament,
  }: {
    getFilter: (key: keyof StandingsFilters, arg?: any) => boolean;
    toggleFilter: (key: keyof StandingsFilters, arg?: any) => void;
    tournament: Tournament;
  }) => {
    const mostPopularDecks = useMostPopularArchetypes(tournament.id, {
      leaveOutZeroCountDecks: true,
    });

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
            <MenuItemOption
              value='day1'
              isChecked={getFilter('day1')}
              onClick={() => toggleFilter('day1')}
            >
              Include day 1
            </MenuItemOption>
            <MenuDivider />
            <MenuOptionGroup type='checkbox'>
              <Grid gridTemplateColumns={'auto auto auto'}>
                {mostPopularDecks?.map(({ id, name, defined_pokemon }, idx) => (
                  <MenuItemOption
                    isChecked={getFilter('decksVisible', id)}
                    onClick={() => toggleFilter('decksVisible', id)}
                    key={idx}
                    value={name}
                  >
                    <SpriteDisplay pokemonNames={defined_pokemon} />
                  </MenuItemOption>
                ))}
              </Grid>
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      </StackItem>
    );
  }
);

StandingsFilterMenu.displayName = 'StandingsFilterMenu';
