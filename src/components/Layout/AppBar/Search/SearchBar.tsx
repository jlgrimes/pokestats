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
import { useState } from 'react';
import { normalizeName } from '../../../../hooks/user';
import { trimQuery } from './helpers';
import { SearchResultType } from './search-types';
import { SearchBarResults } from './SearchBarResults';
import { useRouter } from 'next/router';
import { trackEvent } from '../../../../lib/track';

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

  const fixedQuery = trimQuery(searchQuery);

  return arr
    .filter((el: T) => {
      const relevantString = getRelevantString(el);
      if (!relevantString) return false;

      const wordBlocks = normalizeName(fixedQuery).split(' ');

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
  const { asPath } = useRouter();

  const [searchQuery, setSearchQuery] = useState('');

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

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
          onClick={() => {
            onOpen();
            trackEvent('Search bar clicked', { location: asPath })
          }}
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
          {isOpen && (
            <SearchBarResults
              searchQuery={searchQuery}
              handleClose={handleClose}
            />
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
