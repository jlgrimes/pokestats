import { HStack } from '@chakra-ui/react';
import { memo, useCallback } from 'react';
import { Tournament } from '../../../../../types/tournament';
import { FilterTags } from './FilterTags';
import { StandingsFilterMenu, StandingsFilters } from './StandingsFilterMenu';

export const StandingsFilterContainer = memo(
  ({
    standingsFilters,
    setStandingsFilters,
    tournament,
  }: {
    standingsFilters: StandingsFilters;
    setStandingsFilters: (filters: StandingsFilters) => void;
    tournament: Tournament;
  }) => {
    const getFilter = useCallback(
      (key: keyof StandingsFilters, arg?: number[]) => {
        if (key === 'decksVisible')
          return !!arg?.every(deck =>
            standingsFilters.decksVisible.find(deckId => deckId === deck)
          );
        return standingsFilters[key].value;
      },
      [standingsFilters]
    );

    const toggleFilter = useCallback(
      (key: keyof StandingsFilters, arg?: number[]) => {
        if (key === 'decksVisible' && arg) {
          if (standingsFilters.decksVisible.find(deck => arg.includes(deck))) {
            return setStandingsFilters({
              ...standingsFilters,
              decksVisible: standingsFilters.decksVisible.filter(
                deck => !arg.includes(deck)
              ),
            });
          }

          return setStandingsFilters({
            ...standingsFilters,
            decksVisible: standingsFilters.decksVisible.concat(arg),
          });
        }

        if (key === 'justDay2') {
          return setStandingsFilters({
            ...standingsFilters,
            [key]: {
              ...standingsFilters[key],
              value: !standingsFilters[key].value,
            },
          });
        }
      },
      [standingsFilters, setStandingsFilters]
    );

    return (
      <HStack flexWrap={'wrap'} rowGap={2} paddingLeft={6}>
        <StandingsFilterMenu
          getFilter={getFilter}
          toggleFilter={toggleFilter}
          tournament={tournament}
        />
        <FilterTags
          filters={standingsFilters}
          toggleFilter={toggleFilter}
          tournament={tournament}
        />
      </HStack>
    );
  }
);

StandingsFilterContainer.displayName = 'StandingsFilterContainer';
