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
} from '@chakra-ui/react';
import { Fragment, useMemo, useState } from 'react';
import { DeckArchetype } from '../../../../../types/tournament';
import { useMostPopularArchetypes } from '../../../../hooks/deckArchetypes';
import SpriteAndNameDisplay from '../../../common/SpriteAndNameDisplay';
import SpriteDisplay from '../../../common/SpriteDisplay';

interface ArchetypeSelectorProps {
  selectedArchetype: number | undefined;
  onChange: (value: number) => void;
  modalControls: UseDisclosureProps;
  shouldShowAsText?: boolean;
  tournamentId: string;
  unownOverride?: string;
}

export default function ArchetypeSelector(props: ArchetypeSelectorProps) {
  const mostPopularDecks = useMostPopularArchetypes(props.tournamentId);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const modalControls = props.modalControls ?? {};

  const handleArchetypeChange = (deckId: number) => {
    props.onChange(deckId);
    modalControls.onClose && modalControls.onClose();
  };

  const handleFilterChange = (e: Record<string, any>) => {
    setFilterQuery(e.target.value);
  };

  const filteredDecks: DeckArchetype[] = useMemo(
    () => [
      ...(mostPopularDecks?.filter(({ name }) => {
        return name.toLowerCase().includes(filterQuery.toLowerCase());
      }) ?? []),
      {
        id: -1,
        name: 'Other',
        defined_pokemon: ['substitute'],
        identifiable_cards: [],
      },
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
        const displayedPokemonNames =
          mostPopularDecks?.find(deck => deck.id === props.selectedArchetype)
            ?.defined_pokemon ?? [];

        return <SpriteDisplay pokemonNames={displayedPokemonNames} />;
      } else {
        return (
          <Flex justifyContent={'center'}>
            <Image
              height='30px'
              src={`https://img.pokemondb.net/sprites/diamond-pearl/normal/unown-${
                props.unownOverride ?? 'qm'
              }.png`}
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
        <Modal
          isOpen={modalControls.isOpen}
          onClose={modalControls.onClose ?? (() => {})}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Select deck</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder='Filter archetype'
                onChange={handleFilterChange}
              />
              <Stack height={'220px'} overflowY={'scroll'} padding={4}>
                {filteredDecks?.map(({ id, name, defined_pokemon }, idx) => (
                  <div key={idx} onClick={() => handleArchetypeChange(id)}>
                    <SpriteAndNameDisplay
                      archetypeName={name}
                      pokemonNames={defined_pokemon}
                    />
                  </div>
                ))}
              </Stack>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Fragment>
  );
}
