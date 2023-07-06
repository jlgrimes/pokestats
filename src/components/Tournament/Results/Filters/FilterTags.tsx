import {
  Box,
  HStack,
  Tag,
  TagCloseButton,
  TagLabel,
  TagProps,
  Text,
} from '@chakra-ui/react';
import { Fragment } from 'react';
import { Tournament } from '../../../../../types/tournament';
import {
  useArchetypes,
  useMostPopularArchetypes,
} from '../../../../hooks/deckArchetypes';
import SpriteDisplay from '../../../common/SpriteDisplay/SpriteDisplay';
import { sortBySuperType } from './helpers';
import { ToggleFilterOptions } from './StandingsFilterContainer';
import { StandingsFilters } from './StandingsFilterMenu';

// Needed for Object.Entries. Love typescript.
type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export const FilterTags = ({
  filters,
  toggleFilter,
  tournament,
}: {
  filters: StandingsFilters;
  toggleFilter: (
    key: keyof StandingsFilters,
    options?: ToggleFilterOptions
  ) => void;
  tournament: Tournament;
}) => {
  const { data: archetypes } = useMostPopularArchetypes(tournament);
  const supertypes = sortBySuperType(archetypes);

  const tagProps: Partial<TagProps> = {
    size: 'lg',
    borderRadius: 'full',
    outline: 'solid',
    boxShadow: '',
  };

  return (
    <HStack flexWrap={'wrap'} flexDirection='row-reverse'>
      {(Object.entries(filters) as Entries<StandingsFilters>).map(
        ([key, val], idx) => {
          if (key === 'decksVisible') {
            return (
              <Fragment key={`${key}`}>
                {val.map((deckId: number) => {
                  const deckArchetype = archetypes?.find(
                    ({ id }) => deckId === id
                  );
                  if (deckArchetype) {
                    return (
                      <Tag {...tagProps} key={`${key}-${deckId}`}>
                        <HStack spacing={1}>
                          <SpriteDisplay
                            pokemonNames={deckArchetype?.defined_pokemon ?? []}
                            squishWidth
                          />
                          {/* <Text fontSize={'sm'} as='b'>{deckArchetype?.count}</Text> */}
                        </HStack>
                        <TagCloseButton
                          onClick={() =>
                            toggleFilter('decksVisible', {
                              individualDeck: deckId,
                            })
                          }
                        />
                      </Tag>
                    );
                  }
                  return <div key={`${key}-${deckId}`}></div>;
                })}
              </Fragment>
            );
          }

          if (key === 'supertypesVisible') {
            return (
              <Fragment key={`${key}`}>
                {val.map((deckId: number) => {
                  const supertype = supertypes?.find(
                    ({ supertype }) => deckId === supertype.id
                  );
                  if (supertype) {
                    return (
                      <Tag {...tagProps} key={`${key}-${deckId}`}>
                        <HStack spacing={1}>
                          <SpriteDisplay
                            pokemonNames={supertype.supertype?.defined_pokemon ?? []}
                            squishWidth
                          />
                          {/* <Text fontSize={'sm'} as='b'>{deckArchetype?.count}</Text> */}
                        </HStack>
                        <TagCloseButton
                          onClick={() =>
                            toggleFilter('supertypesVisible', {
                              individualDeck: deckId,
                            })
                          }
                        />
                      </Tag>
                    );
                  }
                  return <div key={`${key}-${deckId}`}></div>;
                })}
              </Fragment>
            );
          }

          if (val.value) {
            return (
              <Tag key={key} {...tagProps}>
                <TagLabel fontSize={'sm'}>{val.name}</TagLabel>
                <TagCloseButton onClick={() => toggleFilter(key)} />
              </Tag>
            );
          }

          return <div key={key}></div>;
        }
      )}
    </HStack>
  );
};
