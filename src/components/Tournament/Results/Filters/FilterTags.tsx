import { HStack, Tag, TagCloseButton, TagLabel, Text } from '@chakra-ui/react';
import { Tournament } from '../../../../../types/tournament';
import {
  useArchetypes,
  useMostPopularArchetypes,
} from '../../../../hooks/deckArchetypes';
import SpriteDisplay from '../../../common/SpriteDisplay';
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
  toggleFilter: (key: keyof StandingsFilters, arg?: any) => void;
  tournament: Tournament;
}) => {
  const archetypes = useMostPopularArchetypes(tournament.id, {
    includeDeckCounts: true,
  });

  return (
    <>
      {(Object.entries(filters) as Entries<StandingsFilters>).map(
        ([key, val], idx) => {
          if (key === 'decksVisible') {
            return (
              <>
                {val!.map((deckId: number, idx: number) => {
                  const deckArchetype = archetypes?.find(
                    ({ id }) => deckId === id
                  );
                  return (
                    <Tag size='lg' key={idx} borderRadius='full'>
                      <HStack spacing={1}>
                        <SpriteDisplay
                          key={`filter-deck-${idx}`}
                          pokemonNames={deckArchetype?.defined_pokemon ?? []}
                          squishWidth
                        />
                        {/* <Text fontSize={'sm'} as='b'>{deckArchetype?.count}</Text> */}
                      </HStack>
                      <TagCloseButton
                        onClick={() => toggleFilter('decksVisible', deckId)}
                      />
                    </Tag>
                  );
                })}
              </>
            );
          }

          if (val.value) {
            return (
              <Tag size='lg' key={idx} borderRadius='full'>
                <TagLabel fontSize={'sm'}>{val.name}</TagLabel>
                <TagCloseButton onClick={() => toggleFilter(key)} />
              </Tag>
            );
          }
        }
      )}
    </>
  );
};
