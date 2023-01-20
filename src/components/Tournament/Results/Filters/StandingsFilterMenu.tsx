import {
  Box,
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
  Tag,
  Text,
} from '@chakra-ui/react';
import { Fragment, memo } from 'react';
import { FaFilter } from 'react-icons/fa';
import { Tournament } from '../../../../../types/tournament';
import { useMostPopularArchetypes } from '../../../../hooks/deckArchetypes';
import { FilterMenu } from '../../../common/FilterMenu';
import SpriteDisplay from '../../../common/SpriteDisplay';
import { sortBySuperType } from './helpers';
import { ToggleFilterOptions } from './StandingsFilterContainer';

export interface Filter {
  name: string;
  value: boolean;
}

export interface StandingsFilters {
  justDay2: Filter;
  onStream: Filter;
  decksVisible: number[];
}

export const StandingsFilterMenu = memo(
  ({
    getFilter,
    toggleFilter,
    tournament,
    disabled,
  }: {
    getFilter: (key: keyof StandingsFilters, arg?: any) => boolean;
    toggleFilter: (
      key: keyof StandingsFilters,
      options?: ToggleFilterOptions
    ) => void;
    tournament: Tournament;
    disabled?: boolean;
  }) => {
    const mostPopularDecks = useMostPopularArchetypes(tournament.id);

    const supertypeCollection = sortBySuperType(mostPopularDecks);

    return (
      <FilterMenu disabled={disabled}>
        <Fragment>
          <MenuOptionGroup title='Results' type='checkbox'>
            <MenuItemOption
              value='justDay2'
              isChecked={getFilter('justDay2')}
              onClick={() => toggleFilter('justDay2')}
            >
              Day 2
            </MenuItemOption>
            <MenuItemOption
              value='onStream'
              isChecked={getFilter('onStream')}
              onClick={() => toggleFilter('onStream')}
            >
              Featured on stream
            </MenuItemOption>
          </MenuOptionGroup>
          <MenuDivider />
          <MenuOptionGroup title='Archetype'>
            <Grid gridTemplateColumns={`1fr 1fr`} gap={2} paddingX={2}>
              {supertypeCollection?.map(
                (supertype, idx) =>
                  supertype.decks.length > 1 && (
                    <Tag variant={'outline'} key={idx}>
                      <MenuItemOption
                        background={'none'}
                        height='100%'
                        alignItems={'center'}
                        padding={'0.25rem 0'}
                        isChecked={getFilter(
                          'decksVisible',
                          supertype.decks.map(({ id }) => id)
                        )}
                        onClick={() =>
                          toggleFilter('decksVisible', {
                            superType: supertype.decks,
                          })
                        }
                      >
                        <HStack spacing={1}>
                          <SpriteDisplay
                            squishWidth
                            pokemonNames={[supertype.definedPokemon]}
                          />
                          <Text as='b'>{supertype.archetypeName}</Text>
                        </HStack>
                      </MenuItemOption>
                    </Tag>
                  )
              )}
            </Grid>
          </MenuOptionGroup>

          <MenuOptionGroup title='Individual deck'>
            <Grid
              key={`supertype-collection-grid`}
              gridTemplateColumns={`1fr repeat(3, 1fr)`}
            >
              {mostPopularDecks?.map(({ id, name, defined_pokemon }) => (
                <MenuItemOption
                  padding={0}
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
          </MenuOptionGroup>
        </Fragment>
      </FilterMenu>
    );
  }
);

StandingsFilterMenu.displayName = 'StandingsFilterMenu';
