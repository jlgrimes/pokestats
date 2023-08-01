import { Stack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useArchetypes, useSupertypes } from '../../../../hooks/deckArchetypes';
import { useFinalResultsPlayers } from '../../../../hooks/finalResults/fetch';
import { useTournaments } from '../../../../hooks/tournaments';
import { useSmartPlayerProfiles } from '../../../../hooks/user';
import { appSearchResultComparator } from './helpers';
import { SearchResultSchema } from './search-types';
import { getRelevantSearchResults } from './SearchBar';
import { SearchResult } from './SearchResult';

interface SearchBarResultsProps {
  searchQuery: string;
  handleClose: () => void;
}

export const SearchBarResults = (props: SearchBarResultsProps) => {
  const { data: names } = useFinalResultsPlayers();
  const { data: playerProfiles } = useSmartPlayerProfiles();
  const { data: tournaments } = useTournaments();
  const { data: archetypes } = useArchetypes();
  const { data: supertypes } = useSupertypes();
  console.log('loading everything dumb')

  const additionalNames = useMemo(
    () =>
      playerProfiles?.reduce(
        (acc: string[], curr) =>
          curr.additional_names ? [...acc, ...curr.additional_names] : acc,
        []
      ),
    [playerProfiles]
  );

  const playerList = useMemo(
    () =>
      names
        ?.map(
          name =>
            playerProfiles?.find(player => player.name === name) || {
              name,
              username: null,
            }
        )
        .filter(player => !additionalNames?.includes(player.name))
        .sort((a, b) => {
          if (a.username) return -1;
          if (b.username) return 1;
          return 0;
        }),
    [names, playerProfiles, additionalNames]
  );

  const searchResults: SearchResultSchema[] = useMemo(
    () => [
      ...getRelevantSearchResults(
        playerList,
        'player',
        player => player.name,
        props.searchQuery
      ),
      ...getRelevantSearchResults(
        playerList,
        'player',
        player => player.username,
        props.searchQuery
      ),
      ...getRelevantSearchResults(
        tournaments,
        'tournament',
        tournament => tournament.name,
        props.searchQuery
      ),
      ...getRelevantSearchResults(
        archetypes,
        'archetype',
        archetype => archetype.name,
        props.searchQuery
      ),
      ...getRelevantSearchResults(
        archetypes,
        'archetype',
        archetype => archetype.supertype?.name,
        props.searchQuery
      ),
      ...getRelevantSearchResults(
        supertypes,
        'supertype',
        supertype => supertype.name,
        props.searchQuery
      ),
    ],
    [archetypes, playerList, props.searchQuery, supertypes, tournaments]
  );

  const optimizedSearchResults = useMemo(
    () =>
      searchResults
        .sort(appSearchResultComparator(props.searchQuery))
        .filter((result, idx) => {
          return !searchResults.slice(0, idx).some(existingResult => {
            return (
              existingResult.type === result.type &&
              existingResult.data.id === result.data.id
            );
          });
        }),
    [props.searchQuery, searchResults]
  );

  const shouldShowSearchResults = optimizedSearchResults.length > 0;

  return shouldShowSearchResults ? (
    <Stack paddingX={4} paddingY={4}>
      {optimizedSearchResults.map((result, idx) => (
        <SearchResult
          key={`search-result-${idx}`}
          result={result}
          handleClose={props.handleClose}
        />
      ))}
    </Stack>
  ) : null;
};
