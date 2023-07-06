import { Box, Grid, HStack } from '@chakra-ui/react';
import { memo, useCallback, useMemo } from 'react';
import { Deck, Tournament } from '../../../../../types/tournament';
import { FilterTags } from './FilterTags';
import { StandingsFilterMenu, StandingsFilters } from './StandingsFilterMenu';

export interface ToggleFilterOptions {
  // ID of the individual deck we want to toggle.
  individualDeck?: number;
  // Name of the defined pokemon.
  superType?: Deck[];
}

export const StandingsFilterContainer = memo(
  ({
    standingsFilters,
    setStandingsFilters,
    tournament,
    disabled,
  }: {
    standingsFilters: StandingsFilters;
    setStandingsFilters: (filters: StandingsFilters) => void;
    tournament: Tournament;
    disabled?: boolean;
  }) => {
    const getFilter = useCallback(
      (key: keyof StandingsFilters, arg?: number[]) => {
        if (key === 'decksVisible')
          return !!arg?.every(deck =>
            standingsFilters.decksVisible.find(deckId => deckId === deck)
          );

        if (key === 'supertypesVisible')
          return !!arg?.every(deck =>
            standingsFilters.supertypesVisible.find(deckId => deckId === deck)
          );

        return standingsFilters[key].value;
      },
      [standingsFilters]
    );

    const toggleFilter = useCallback(
      (key: keyof StandingsFilters, options?: ToggleFilterOptions) => {
        if (key === 'decksVisible') {
          if (options?.individualDeck) {
            if (
              standingsFilters.decksVisible.find(
                deck => deck === options.individualDeck
              )
            ) {
              return setStandingsFilters({
                ...standingsFilters,
                decksVisible: standingsFilters.decksVisible.filter(
                  deck => deck !== options.individualDeck
                ),
              });
            }

            return setStandingsFilters({
              ...standingsFilters,
              decksVisible: standingsFilters.decksVisible.concat(
                options.individualDeck
              ),
            });
          }

          if (options?.superType) {
            // This is if all of them are checked
            if (
              options.superType.length === standingsFilters.decksVisible.length
            ) {
              return setStandingsFilters({
                ...standingsFilters,
                decksVisible: standingsFilters.decksVisible.filter(
                  visibleDeck =>
                    !standingsFilters.decksVisible.includes(visibleDeck)
                ),
              });
            }
            // If all of them are not checked
            const remainingDecksToCheck = options.superType.filter(
              deck => !standingsFilters.decksVisible.includes(deck.id)
            );
            return setStandingsFilters({
              ...standingsFilters,
              decksVisible: standingsFilters.decksVisible.concat(
                remainingDecksToCheck.map(({ id }) => id)
              ),
            });
          }
        }

        if (key === 'supertypesVisible') {
          if (options?.individualDeck) {
            if (
              standingsFilters.supertypesVisible.find(
                deck => deck === options.individualDeck
              )
            ) {
              return setStandingsFilters({
                ...standingsFilters,
                supertypesVisible: standingsFilters.supertypesVisible.filter(
                  deck => deck !== options.individualDeck
                ),
              });
            }

            return setStandingsFilters({
              ...standingsFilters,
              supertypesVisible: standingsFilters.supertypesVisible.concat(
                options.individualDeck
              ),
            });
          }
        }

        if (key === 'justDay2' || key === 'onStream' || key === 'deckKnown') {
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
      <Box position='fixed' bottom='12px' right={['12px', '80px']} zIndex={3}>
        <Grid gridTemplateColumns='auto 120px' justifyContent='baseline'>
          <FilterTags
            filters={standingsFilters}
            toggleFilter={toggleFilter}
            tournament={tournament}
          />
          <StandingsFilterMenu
            getFilter={getFilter}
            toggleFilter={toggleFilter}
            tournament={tournament}
            disableDeckFilter={disabled}
          />
        </Grid>
      </Box>
    );
  }
);

StandingsFilterContainer.displayName = 'StandingsFilterContainer';
