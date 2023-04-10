import {
  Box,
  Button,
  Checkbox,
  Grid,
  GridItem,
  HStack,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Stack,
  StackItem,
  Tag,
  Text,
} from '@chakra-ui/react';
import { Fragment, memo } from 'react';
import { FaFilter } from 'react-icons/fa';
import { Tournament } from '../../../../../types/tournament';
import { useMostPopularArchetypes } from '../../../../hooks/deckArchetypes';
import { FilterMenu } from '../../../common/FilterMenu';
import SpriteDisplay from '../../../common/SpriteDisplay/SpriteDisplay';
import { sortBySuperType } from './helpers';
import { ToggleFilterOptions } from './StandingsFilterContainer';

export interface Filter {
  name: string;
  value: boolean;
}

export interface StandingsFilters {
  justDay2: Filter;
  onStream: Filter;
  deckKnown: Filter;
  decksVisible: number[];
}

export const StandingsFilterMenu = memo(
  ({
    getFilter,
    toggleFilter,
    tournament,
    disableDeckFilter,
  }: {
    getFilter: (key: keyof StandingsFilters, arg?: any) => boolean;
    toggleFilter: (
      key: keyof StandingsFilters,
      options?: ToggleFilterOptions
    ) => void;
    tournament: Tournament;
    disableDeckFilter?: boolean;
  }) => {
    const { data: mostPopularDecks } = useMostPopularArchetypes(tournament);

    const supertypeCollection = sortBySuperType(mostPopularDecks);

    return (
      <FilterMenu>
        <Fragment>
          <MenuOptionGroup title='Results' type='checkbox'>
            <Stack paddingX={4}>
              <Checkbox
                isChecked={getFilter('justDay2')}
                onChange={() => toggleFilter('justDay2')}
              >
                Day 2
              </Checkbox>
              <Checkbox
                isChecked={getFilter('onStream')}
                onChange={() => toggleFilter('onStream')}
              >
                Featured on stream
              </Checkbox>
              <Checkbox
                isChecked={getFilter('deckKnown')}
                onChange={() => toggleFilter('deckKnown')}
              >
                Deck is known
              </Checkbox>
            </Stack>
          </MenuOptionGroup>
          <MenuDivider />
          {!disableDeckFilter && (
            <Fragment>
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
                  {mostPopularDecks?.map(
                    popularDeck =>
                      popularDeck && (
                        <MenuItemOption
                          padding={0}
                          isChecked={getFilter('decksVisible', [
                            popularDeck.id,
                          ])}
                          onClick={() =>
                            toggleFilter('decksVisible', {
                              individualDeck: popularDeck.id,
                            })
                          }
                          key={popularDeck.name}
                          value={popularDeck.name}
                        >
                          <SpriteDisplay
                            squishWidth
                            pokemonNames={popularDeck.defined_pokemon}
                          />
                        </MenuItemOption>
                      )
                  )}
                </Grid>
              </MenuOptionGroup>
            </Fragment>
          )}
        </Fragment>
      </FilterMenu>
    );
  }
);

StandingsFilterMenu.displayName = 'StandingsFilterMenu';
