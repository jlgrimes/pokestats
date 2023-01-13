import {
  Button,
  Grid,
  GridItem,
  HStack,
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
import { DeckArchetype, Tournament } from '../../../../../types/tournament';
import { useMostPopularArchetypes } from '../../../../hooks/deckArchetypes';
import SpriteDisplay from '../../../common/SpriteDisplay';
import { sortBySuperType } from './helpers';
import { ToggleFilterOptions } from './StandingsFilterContainer';

export interface Filter {
  name: string;
  value: boolean;
}

export interface StandingsFilters {
  justDay2: Filter;
  decksVisible: number[];
}

export const StandingsFilterMenu = memo(
  ({
    getFilter,
    toggleFilter,
    tournament,
  }: {
    getFilter: (key: keyof StandingsFilters, arg?: any) => boolean;
    toggleFilter: (
      key: keyof StandingsFilters,
      options?: ToggleFilterOptions
    ) => void;
    tournament: Tournament;
  }) => {
    const mostPopularDecks = useMostPopularArchetypes(tournament.id, {
      leaveOutZeroCountDecks: true,
    });

    const supertypeCollection = sortBySuperType(mostPopularDecks);

    return (
      <StackItem>
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
            <MenuOptionGroup title='Placement'>
              <MenuItemOption
                value='justDay2'
                isChecked={getFilter('justDay2')}
                onClick={() => toggleFilter('justDay2')}
              >
                Only Day 2
              </MenuItemOption>
            </MenuOptionGroup>
            <MenuDivider />
            {supertypeCollection?.map((supertype, idx) => (
              <Grid key={`supertype-collection-${idx}`} gridTemplateColumns={`1fr repeat(2, 1fr)`}>
                <GridItem gridRow={'1/10'}>
                  <MenuItemOption
                    isChecked={getFilter(
                      'decksVisible',
                      supertype.decks.map(({ id }) => id)
                    )}
                    onClick={() =>
                      toggleFilter('decksVisible', { superType: supertype.decks })
                    }
                  >
                    <SpriteDisplay
                      squishWidth
                      pokemonNames={[supertype.name]}
                    />
                  </MenuItemOption>
                </GridItem>
                {supertype.decks.map(({ id, name, defined_pokemon }) => (
                  <MenuItemOption
                    isChecked={getFilter('decksVisible', [id])}
                    onClick={() =>
                      toggleFilter('decksVisible', { individualDeck: id })
                    }
                    key={name}
                    value={name}
                  >
                    <SpriteDisplay squishWidth pokemonNames={defined_pokemon} />
                  </MenuItemOption>
                ))}
              </Grid>
            ))}
          </MenuList>
        </Menu>
      </StackItem>
    );
  }
);

StandingsFilterMenu.displayName = 'StandingsFilterMenu';
