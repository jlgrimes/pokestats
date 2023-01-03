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
import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  useMostPopularArchetypes,
} from '../../../../hooks/deckArchetypes';
import SpriteAndNameDisplay from '../../../common/SpriteAndNameDisplay';
import SpriteDisplay from '../../../common/SpriteDisplay';

interface ArchetypeSelectorProps {
  value: string | undefined;
  onChange: (value: string) => void;
  modalControls: UseDisclosureProps;
  quickEdit: boolean;
  shouldShowAsText?: boolean;
  tournamentId: string;
  unownOverride?: string;
}

export default function ArchetypeSelector(props: ArchetypeSelectorProps) {
  const [selectedArchetype, setSelectedArchetype] = useState<
    string | undefined
  >(props.value);
  const mostPopularDecks = useMostPopularArchetypes(props.tournamentId);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const modalControls = props.modalControls ?? {};

  const isArchetypeSelected = selectedArchetype && selectedArchetype.length > 0;

  const handleArchetypeChange = (deck: string) => {
    props.onChange(deck);
    setSelectedArchetype(deck);
    modalControls.onClose && modalControls.onClose();
  };

  const handleFilterChange = (e: Record<string, any>) => {
    setFilterQuery(e.target.value);
  };

  useEffect(() => {
    if (props.value) {
      setSelectedArchetype(props.value);
    }
  }, [props.value]);

  const filteredDecks = useMemo(
    () => [
      ...(mostPopularDecks?.filter(({ name }) => {
        return name.toLowerCase().includes(filterQuery.toLowerCase());
      }) ?? []),
      { name: 'Other', defined_pokemon: ['substitute'] },
    ],
    [mostPopularDecks, filterQuery]
  );

  const renderDeckName = () => {
    if (props.shouldShowAsText) {
      return <Text>{isArchetypeSelected ? selectedArchetype : 'Unknown deck'}</Text>;
    } else {
      if (isArchetypeSelected) {
        const displayedPokemonNames =
          mostPopularDecks?.find(deck => deck.name === selectedArchetype)
            ?.defined_pokemon ?? [];

        return <SpriteDisplay pokemonNames={displayedPokemonNames} />;
      } else {
        return (
          <Flex justifyContent={'center'}>
            <Image
              height='30px'
              src={`https://img.pokemondb.net/sprites/diamond-pearl/normal/unown-${props.unownOverride ?? 'qm'}.png`}
              alt='Unown'
            />
          </Flex>
        );
      }
    }
  };

  const renderButtonDisplay = () => {
    if (props.quickEdit) {
      return (
        <Button
          variant={isArchetypeSelected ? 'outline' : 'ghost'}
          width={'100%'}
          onClick={modalControls.onOpen}
        >
          {renderDeckName()}
        </Button>
      );
    }

    return renderDeckName();
  };

  return (
    <Fragment>
      {renderButtonDisplay()}
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
                {filteredDecks?.map(({ name, defined_pokemon }, idx) => (
                  <div key={idx} onClick={() => handleArchetypeChange(name)}>
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
