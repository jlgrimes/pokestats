import { ChevronDownIcon, EditIcon } from '@chakra-ui/icons';
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  Input,
  IconButton,
  SimpleGrid,
  Td,
} from '@chakra-ui/react';
import { Fragment, memo, useEffect, useMemo, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useArchetypes } from '../../../../hooks/deckArchetypes';
import SpriteAndNameDisplay from '../../../common/SpriteAndNameDisplay';
import SpriteDisplay from '../../../common/SpriteDisplay';
import AddArchetypeModal from './AddArchetypeModal';

interface ArchetypeSelectorProps {
  value: string | undefined;
  onChange: (value: string) => void;
  quickEdit: boolean;
}

export default function ArchetypeSelector(props: ArchetypeSelectorProps) {
  const [selectedArchetype, setSelectedArchetype] = useState<
    string | undefined
  >(props.value);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: decks } = useArchetypes();
  const [filterQuery, setFilterQuery] = useState<string>('');

  const isArchetypeSelected = selectedArchetype && selectedArchetype.length > 0;

  const handleArchetypeChange = (deck: string) => {
    props.onChange(deck);
    setSelectedArchetype(deck);
    onClose();
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
    () =>
      decks?.filter(({ name }) => {
        return name.toLowerCase().includes(filterQuery.toLowerCase());
      }),
    [decks, filterQuery]
  );

  const renderButtonDisplay = () => {
    const displayedPokemonNames =
      decks?.find(deck => deck.name === selectedArchetype)?.defined_pokemon ??
      [];

    if (props.quickEdit) {
      return (
        <Button
          variant={isArchetypeSelected ? 'outline' : 'ghost'}
          width={'100%'}
          onClick={onOpen}
        >
          {isArchetypeSelected ? (
            <SpriteDisplay pokemonNames={displayedPokemonNames} />
          ) : (
            <EditIcon />
          )}
        </Button>
      );
    }

    return (
      <Stack direction={'row'}>
        <SpriteDisplay pokemonNames={displayedPokemonNames} />
        <IconButton
          maxWidth={'2'}
          icon={<EditIcon />}
          aria-label='edit'
          variant={'ghost'}
          width={'100%'}
          onClick={onOpen}
        />
      </Stack>
    );
  };

  return (
    <Fragment>
      {renderButtonDisplay()}
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Select deck</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder='Filter archetype'
                onChange={handleFilterChange}
              />
              <Stack height={'300px'} overflowY={'scroll'} padding={4}>
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
