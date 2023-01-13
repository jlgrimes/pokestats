import {
  Button,
  Grid,
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
    toggleFilter: (key: keyof StandingsFilters, arg?: any) => void;
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
              <>
                <SpriteDisplay pokemonNames={[supertype.name]} />
                {supertype.decks.map(({ id, name, defined_pokemon }) => (
                  <MenuItemOption
                    isChecked={getFilter('decksVisible', id)}
                    onClick={() => toggleFilter('decksVisible', [id])}
                    key={idx}
                    value={name}
                  >
                    <SpriteDisplay pokemonNames={defined_pokemon} />
                  </MenuItemOption>
                ))}
              </>
            ))}
            {/* <MenuOptionGroup title='Deck archetype' type='checkbox'>
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
            </MenuOptionGroup> */}
          </MenuList>
        </Menu>
      </StackItem>
    );
  }
);

StandingsFilterMenu.displayName = 'StandingsFilterMenu';
