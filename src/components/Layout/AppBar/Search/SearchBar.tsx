import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Card,
  Grid,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  LinkBox,
  LinkOverlay,
  Modal,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useMemo, useState } from 'react';
import { Tournament } from '../../../../../types/tournament';
import { useArchetypes, useSupertypes } from '../../../../hooks/deckArchetypes';
import { useFinalResultsPlayers } from '../../../../hooks/finalResults/fetch';
import { useTournaments } from '../../../../hooks/tournaments';
import { normalizeName, usePlayerProfiles } from '../../../../hooks/user';
import { appSearchResultComparator } from './helpers';
import { SearchResultSchema, SearchResultType } from './search-types';
import { SearchResult } from './SearchResult';

interface SearchBarProps {
  shouldCollapsePlaceholder: boolean;
}

export function getRelevantSearchResults<T>(
  arr: T[] | null | undefined,
  type: SearchResultType,
  getRelevantString: (el: T) => string | null | undefined,
  searchQuery: string
) {
  if (!arr || searchQuery.length === 0) return [];

  return arr
    .filter((el: T) => {
      const relevantString = getRelevantString(el);
      if (!relevantString) return false;

      const wordBlocks = normalizeName(searchQuery).split(' ');

      const normalizedWord = normalizeName(relevantString);

      let currentIdx = 0;
      for (const block of wordBlocks) {
        if (normalizedWord.includes(block, currentIdx)) {
          currentIdx = normalizedWord.indexOf(block);
        } else {
          return false;
        }
      }

      return true;
    })
    .map((data: T) => ({ type, data, match: getRelevantString(data) }))
    .slice(0, 4);
}

export const SearchBar = (props: SearchBarProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: names } = useFinalResultsPlayers();
  const { data: playerProfiles } = usePlayerProfiles();
  const { data: tournaments } = useTournaments();
  const { data: archetypes } = useArchetypes();
  const { data: supertypes } = useSupertypes();

  const [searchQuery, setSearchQuery] = useState('');

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

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
        searchQuery
      ),
      ...getRelevantSearchResults(
        playerList,
        'player',
        player => player.username,
        searchQuery
      ),
      ...getRelevantSearchResults(
        tournaments,
        'tournament',
        tournament => tournament.name,
        searchQuery
      ),
      ...getRelevantSearchResults(
        archetypes,
        'archetype',
        archetype => archetype.name,
        searchQuery
      ),
      ...getRelevantSearchResults(
        archetypes,
        'archetype',
        archetype => archetype.supertype?.name,
        searchQuery
      ),
      ...getRelevantSearchResults(
        supertypes,
        'supertype',
        supertype => supertype.name,
        searchQuery
      ),
    ],
    [archetypes, playerList, searchQuery, supertypes, tournaments]
  );

  const optimizedSearchResults = useMemo(
    () =>
      searchResults
        .sort(appSearchResultComparator(searchQuery))
        .filter((result, idx) => {
          return !searchResults.slice(0, idx).some(existingResult => {
            return (
              existingResult.type === result.type &&
              existingResult.data.id === result.data.id
            );
          });
        }),
    [searchQuery, searchResults]
  );

  const shouldShowSearchResults = optimizedSearchResults.length > 0;

  return (
    <>
      {props.shouldCollapsePlaceholder ? (
        <IconButton
          variant='outline'
          icon={<SearchIcon />}
          aria-label='app search'
          onClick={onOpen}
        />
      ) : (
        <Button
          variant='outline'
          leftIcon={<SearchIcon />}
          flexGrow={1}
          justifyContent='flex-start'
          onClick={onOpen}
          maxWidth={'30rem'}
        >
          <Text fontWeight='normal' color='gray'>
            Search anything
          </Text>
        </Button>
      )}
      <Modal isOpen={isOpen} onClose={handleClose} size='xs'>
        <ModalOverlay />
        <ModalContent padding={2}>
          <InputGroup>
            <InputLeftElement>
              <SearchIcon />
            </InputLeftElement>
            <Input
              placeholder='Search anything'
              autoFocus
              // onBlur={() => handleClose()}
              style={{ border: 'none' }}
              _focusVisible={{ outline: 'none' }}
              height={10}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          {shouldShowSearchResults && (
            <Stack paddingX={4} paddingY={4}>
              {optimizedSearchResults.map((result, idx) => (
                <SearchResult
                  key={`search-result-${idx}`}
                  result={result}
                  handleClose={handleClose}
                />
              ))}
            </Stack>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
