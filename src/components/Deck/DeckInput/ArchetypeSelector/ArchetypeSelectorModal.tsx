import { memo, useMemo, useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Stack,
  Input,
  Text,
  Link,
  ModalFooter,
  StackItem,
  Checkbox,
  HStack,
  useDisclosure,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import SpriteAndNameDisplay from '../../../common/SpriteDisplay/SpriteAndNameDisplay';
import { Deck } from '../../../../../types/tournament';
import {
  DeckTypeSchema,
  useMostPopularArchetypes,
} from '../../../../hooks/deckArchetypes';
import { ArchetypeSelectorProps } from './ArchetypeSelector';
import { useTwitterLink } from '../../../../hooks/twitter';
import AddArchetypeModal from './AddArchetypeModal';
import { FaDog } from 'react-icons/fa';

export const ArchetypeSelectorModal = memo((props: ArchetypeSelectorProps) => {
  const [selectedArchetype, setSelectedArchetype] = useState<Deck | null>(null);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const { data: mostPopularDecks, refetchArchetypes } =
    useMostPopularArchetypes(props.tournament, {
      shouldIncludeDecksNotPlayed: true,
      shouldNotFetchData: !props.modalControls.isOpen
    });
  const addArchetypeModalControls = useDisclosure();
  const myTwitter = useTwitterLink('jgrimesey');

  const filteredDecks: DeckTypeSchema[] = useMemo(
    () => [
      ...(mostPopularDecks?.filter(({ name, hide_from_selection }) => {
        if (props.shouldHideFakeDecks && hide_from_selection) return false;

        return (
          name.toLowerCase().includes(filterQuery.toLowerCase()) ||
          name === 'Other'
        );
      }) ?? []),
    ],
    [mostPopularDecks, filterQuery]
  );

  const handleArchetypeChange = (deck: Deck) => {
    setSelectedArchetype(deck);
  };

  const handleArchetypeSubmit = (deck: Deck) => {
    props.onChange(deck);
    props.modalControls.onClose && props.modalControls.onClose();
  };

  const handleFilterChange = (e: Record<string, any>) => {
    setFilterQuery(e.target.value);
  };

  const handleModalClose = () => {
    props.modalControls.onClose && props.modalControls.onClose();
    setSelectedArchetype(null);
  };

  return (
    <Modal isOpen={!!props.modalControls.isOpen} onClose={handleModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Report deck</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            {props.userIsAdmin && (
              <HStack spacing={4}>
                {props.toggleIsStreamDeck && (
                  <Checkbox
                    isChecked={props.isStreamDeck}
                    onChange={props.toggleIsStreamDeck}
                  >
                    On stream
                  </Checkbox>
                )}
                <Button
                  onClick={addArchetypeModalControls.onOpen}
                  leftIcon={<FaDog />}
                >
                  Add new deck
                </Button>
                <AddArchetypeModal
                  isOpen={addArchetypeModalControls.isOpen}
                  onClose={addArchetypeModalControls.onClose}
                  handleArchetypeChange={() => refetchArchetypes()}
                  tournament={props.tournament}
                />
              </HStack>
            )}
            {props.userIsAdmin && props.isListUp && (
              <Text>
                Because lists are up, deck archetype is fed from RK9. Changing
                an archetype here just updates the database for no reason.
              </Text>
            )}
            <Stack spacing={0}>
              <Input
                placeholder='Filter archetype'
                onChange={handleFilterChange}
                autoFocus
              />
              <Stack height={'220px'} overflowY={'scroll'} padding={4}>
                {filteredDecks?.map((deck, idx) => (
                  <StackItem
                    key={idx}
                    p={1}
                    boxShadow={
                      selectedArchetype?.id === deck.id ? 'outline' : 'none'
                    }
                    rounded='md'
                    onClick={() =>
                      props.userIsAdmin
                        ? handleArchetypeSubmit(deck as unknown as Deck)
                        : handleArchetypeChange(deck as unknown as Deck)
                    }
                  >
                    <SpriteAndNameDisplay
                      archetypeName={deck.name}
                      pokemonNames={deck.defined_pokemon}
                    />
                  </StackItem>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </ModalBody>
        {!props.userIsAdmin && (
          <ModalFooter>
            <Button
              colorScheme='blue'
              isDisabled={!selectedArchetype}
              onClick={() =>
                selectedArchetype && handleArchetypeSubmit(selectedArchetype)
              }
            >
              Submit (I understand I cannot resubmit)
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
});

ArchetypeSelectorModal.displayName = 'ArchetypeSelectorModal';
