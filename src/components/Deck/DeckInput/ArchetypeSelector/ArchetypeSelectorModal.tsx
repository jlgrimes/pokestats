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
} from '@chakra-ui/react';
import NextLink from 'next/link';
import SpriteAndNameDisplay from '../../../common/SpriteAndNameDisplay';
import { Deck } from '../../../../../types/tournament';
import { useMostPopularArchetypes } from '../../../../hooks/deckArchetypes';
import { ArchetypeSelectorProps } from './ArchetypeSelector';
import { useTwitterLink } from '../../../../hooks/twitter';

export const ArchetypeSelectorModal = memo((props: ArchetypeSelectorProps) => {
  const [selectedArchetype, setSelectedArchetype] = useState<Deck | null>(null);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const mostPopularDecks = useMostPopularArchetypes(props.tournamentId);
  const myTwitter = useTwitterLink('jgrimesey');

  const filteredDecks: Deck[] = useMemo(
    () => [
      ...(mostPopularDecks?.filter(({ name }) => {
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
              <Checkbox
                isChecked={props.isStreamDeck}
                onChange={props.toggleIsStreamDeck}
              >
                On stream
              </Checkbox>
            )}
            <Stack spacing={0}>
              <Input
                placeholder='Filter archetype'
                onChange={handleFilterChange}
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
                        ? handleArchetypeSubmit(deck)
                        : handleArchetypeChange(deck)
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
            {!props.userIsAdmin && (
              <Text as='b' color='red.600'>
                You can only report a deck once. If you accidentally misreport,
                you can contact{' '}
                <Link
                  isExternal
                  href={myTwitter}
                  as={NextLink}
                  color='twitter.500'
                >
                  @jgrimesey
                </Link>{' '}
                to modify your submission.
              </Text>
            )}
          </Stack>
        </ModalBody>
        {!props.userIsAdmin && (
          <ModalFooter>
            <Button
              colorScheme='blue'
              disabled={!selectedArchetype}
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
