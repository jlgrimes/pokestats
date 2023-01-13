import { HStack, Tag, TagCloseButton, TagLabel } from '@chakra-ui/react';
import { useArchetypes } from '../../../../hooks/deckArchetypes';
import SpriteDisplay from '../../../common/SpriteDisplay';
import { StandingsFilters } from './StandingsFilterMenu';

// Needed for Object.Entries. Love typescript.
type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export const FilterTags = ({
  filters,
  toggleFilter,
}: {
  filters: StandingsFilters;
  toggleFilter: (key: keyof StandingsFilters, arg?: any) => void;
}) => {
  const { data: archetypes } = useArchetypes();

  return (
    <HStack>
      {(Object.entries(filters) as Entries<StandingsFilters>).map(
        ([key, val], idx) => {
          if (key === 'decksVisible') {
            return (
              <>
                {val.map((deckId: number, idx: number) => (
                  <Tag key={idx} borderRadius='full'>
                    <SpriteDisplay
                      key={`filter-deck-${idx}`}
                      pokemonNames={
                        archetypes?.find(({ id }) => deckId === id)
                          ?.defined_pokemon
                      }
                      squishWidth
                    />
                    <TagCloseButton
                      onClick={() => toggleFilter('decksVisible', deckId)}
                    />
                  </Tag>
                ))}
              </>
            );
          }

          return (
            <Tag key={idx} borderRadius='full'>
              <TagLabel>{val.name}</TagLabel>
              <TagCloseButton onClick={() => toggleFilter(key)} />
            </Tag>
          );
        }
      )}
    </HStack>
  );
};
