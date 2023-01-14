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
  Image,
  UseDisclosureProps,
  Text,
  Flex,
  Link,
  ModalFooter,
  StackItem,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { Fragment, useMemo, useState } from 'react';
import { Deck } from '../../../../../types/tournament';
import { useMostPopularArchetypes } from '../../../../hooks/deckArchetypes';
import { useTwitterLink } from '../../../../hooks/twitter';
import { getLowResUnownUrl } from '../../../common/helpers';
import SpriteAndNameDisplay from '../../../common/SpriteAndNameDisplay';
import SpriteDisplay from '../../../common/SpriteDisplay';

interface ArchetypeSelectorProps {
  selectedArchetype: number | undefined;
  onChange: (value: number) => void;
  modalControls: UseDisclosureProps;
  shouldShowAsText?: boolean;
  tournamentId: string;
  unownOverride?: string;
  userIsAdmin: boolean;
  deckIsVerified?: boolean;
}

export default function ArchetypeSelector(props: ArchetypeSelectorProps) {
  const myTwitter = useTwitterLink('jgrimesey');

  const mostPopularDecks = useMostPopularArchetypes(props.tournamentId);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [selectedArchetype, setSelectedArchetype] =
    useState<number | null>(null);

  const modalControls = props.modalControls ?? {};

  const handleArchetypeChange = (deckId: number) => {
    setSelectedArchetype(deckId);
  };

  const handleArchetypeSubmit = (deckId: number) => {
    props.onChange(deckId);
    modalControls.onClose && modalControls.onClose();
  };

  const handleFilterChange = (e: Record<string, any>) => {
    setFilterQuery(e.target.value);
  };

  const handleModalClose = () => {
    modalControls.onClose && modalControls.onClose();
    setSelectedArchetype(null);
  };

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

  const renderDeckName = () => {
    if (props.shouldShowAsText) {
      return (
        <Text>
          {props.selectedArchetype
            ? mostPopularDecks?.find(
                deck => deck.id === props.selectedArchetype
              )?.name
            : 'Unknown deck'}
        </Text>
      );
    } else {
      if (props.selectedArchetype) {
        const deck = mostPopularDecks?.find(deck => deck.id === props.selectedArchetype);
        const displayedPokemonNames = deck?.defined_pokemon ?? [];

        return (
          <SpriteDisplay
            verified={props.deckIsVerified}
            pokemonNames={displayedPokemonNames}
            deckId={deck?.id}
          />
        );
      } else {
        return (
          <Flex justifyContent={'center'} minWidth='4.5rem'>
            <Image
              height='30px'
              src={getLowResUnownUrl(props.unownOverride)}
              alt='Unown'
            />
          </Flex>
        );
      }
    }
  };

  return (
    <Fragment>
      {renderDeckName()}
      {modalControls.isOpen && (
        <Modal isOpen={modalControls.isOpen} onClose={handleModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Report deck</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                <Stack spacing={0}>
                  <Input
                    placeholder='Filter archetype'
                    onChange={handleFilterChange}
                  />
                  <Stack height={'220px'} overflowY={'scroll'} padding={4}>
                    {filteredDecks?.map(
                      ({ id, name, defined_pokemon }, idx) => (
                        <StackItem
                          key={idx}
                          p={1}
                          boxShadow={
                            selectedArchetype === id ? 'outline' : 'none'
                          }
                          rounded='md'
                          onClick={() =>
                            props.userIsAdmin
                              ? handleArchetypeSubmit(id)
                              : handleArchetypeChange(id)
                          }
                        >
                          <SpriteAndNameDisplay
                            archetypeName={name}
                            pokemonNames={defined_pokemon}
                          />
                        </StackItem>
                      )
                    )}
                  </Stack>
                </Stack>
                {!props.userIsAdmin && (
                  <Text as='b' color='red.600'>
                    You can only report a deck once. If you accidentally
                    misreport, you can contact{' '}
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
                    handleArchetypeSubmit(selectedArchetype as number)
                  }
                >
                  Submit (I understand I cannot resubmit)
                </Button>
              </ModalFooter>
            )}
          </ModalContent>
        </Modal>
      )}
    </Fragment>
  );
}
