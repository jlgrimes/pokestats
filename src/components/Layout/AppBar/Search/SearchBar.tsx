import { SearchIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Card,
  Grid,
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
import { useFinalResultsPlayers } from '../../../../hooks/finalResults/fetch';
import { useTournaments } from '../../../../hooks/tournaments';
import { normalizeName, usePlayerProfiles } from '../../../../hooks/user';
import { FollowButton } from '../../../Social/FollowButton';
import { TournamentCard } from '../../../TournamentList/TournamentCard';

interface SearchBarProps {
  shouldCollapsePlaceholder: boolean;
}

export const SearchBar = (props: SearchBarProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: names } = useFinalResultsPlayers();
  const { data: playerProfiles } = usePlayerProfiles();
  const { data: tournaments } = useTournaments();

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

  const playerProfileResults =
    searchQuery.length === 0
      ? []
      : playerList
          ?.filter(
            player =>
              normalizeName(player.name).includes(normalizeName(searchQuery)) ||
              player.username?.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 4);

  const tournamentResults =
    searchQuery.length === 0
      ? []
      : tournaments
          ?.filter(tournament =>
            tournament.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 2);

  const shouldShowSearchResults =
    (playerProfileResults && playerProfileResults.length > 0) ||
    (tournamentResults && tournamentResults.length > 0);

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
              height={10}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </InputGroup>
          {shouldShowSearchResults && (
            <Stack paddingX={4} paddingY={4}>
              {playerProfileResults?.map(player =>
                player.username ? (
                  <LinkBox key={player.name}>
                    <Card paddingY={2} paddingX={4}>
                      <HStack justifyContent='space-between'>
                        <LinkOverlay
                          as={NextLink}
                          href={`/player/${player.username}`}
                          onClick={handleClose}
                        >
                          <Stack spacing={0}>
                            <Text fontWeight='semibold' fontSize='md'>
                              {player.name}
                            </Text>
                            <Text
                              fontSize='sm'
                              fontWeight='medium'
                              opacity='0.7'
                            >
                              {player.username}
                            </Text>
                          </Stack>
                        </LinkOverlay>
                        <Box onClick={e => e.stopPropagation()}>
                          <FollowButton playerName={player.name} />
                        </Box>
                      </HStack>
                    </Card>
                  </LinkBox>
                ) : (
                  <Card
                    variant='filled'
                    paddingY={2}
                    paddingX={4}
                    key={player.name}
                  >
                    <HStack justifyContent='space-between'>
                      <Text fontWeight='semibold' fontSize='md'>
                        {player.name}
                      </Text>
                      <Box>
                        <FollowButton playerName={player.name} />
                      </Box>
                    </HStack>
                  </Card>
                )
              )}
              {tournamentResults?.map(tournament => (
                <Box key={tournament.id} onClick={handleClose}>
                  <TournamentCard tournament={tournament} />
                </Box>
              ))}
            </Stack>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
