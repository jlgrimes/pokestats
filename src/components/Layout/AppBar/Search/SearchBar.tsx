import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Card,
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
import { usePlayerProfiles } from '../../../../hooks/user';

export const SearchBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: playerProfiles } = usePlayerProfiles();

  const [searchQuery, setSearchQuery] = useState('');

  const handleClose = () => {
    setSearchQuery('');
    onClose();
  };

  const playerProfileResults =
    searchQuery.length === 0
      ? []
      : playerProfiles
          ?.filter(
            player =>
              player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              player.username.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5);

  return (
    <>
      <Button
        variant='outline'
        leftIcon={<SearchIcon />}
        flexGrow={1}
        justifyContent='flex-start'
        onClick={onOpen}
      >
        <Text fontWeight='normal' color='gray'>
          Search anything
        </Text>
      </Button>
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
              height={10}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          <Stack paddingX={4} paddingY={4}>
            {playerProfileResults?.map(player => (
              <LinkBox key={player.id}>
                <LinkOverlay
                  as={NextLink}
                  href={`/player/${player.username}`}
                  onClick={handleClose}
                >
                  <Card paddingY={2} paddingX={4}>
                    <Text fontWeight='semibold' fontSize='md'>
                      {player.name}
                    </Text>
                    <Text fontSize='sm' fontWeight='medium' opacity='0.7'>
                      {player.username}
                    </Text>
                  </Card>
                </LinkOverlay>
              </LinkBox>
            ))}
          </Stack>
        </ModalContent>
      </Modal>
    </>
  );
};
