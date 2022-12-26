import { ChevronDownIcon, EditIcon } from '@chakra-ui/icons';
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
} from '@chakra-ui/react';
import { ChangeEvent, Fragment, useEffect, useMemo, useState } from 'react';
import { useArchetypes } from '../../../../../../hooks/deckArchetypes';
import SpriteAndNameDisplay from '../../../../../common/SpriteAndNameDisplay';
import SpriteDisplay from '../../../../../common/SpriteDisplay';
import AddArchetypeModal from './AddArchetypeModal';

interface ArchetypeSelectorProps {
  value: string | undefined;
  onChange: (value: string) => void;
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
  };

  const handleFilterChange = (e: Record<string, any>) => {
    setFilterQuery(e.target.value);
  }

  useEffect(() => {
    if (props.value) {
      setSelectedArchetype(props.value);
    }
  }, [props.value]);

  const filteredDecks = useMemo(() => decks?.filter(({ name }) => {
    return name.toLowerCase().includes(filterQuery.toLowerCase())
  }), [decks, filterQuery])

  return (
    <Fragment>
      <Button
        variant={isArchetypeSelected ? 'outline' : 'ghost'}
        width={'100%'}
        onClick={onOpen}
      >
        {isArchetypeSelected ? (
          <SpriteDisplay
            pokemonNames={
              decks?.find(deck => deck.name === selectedArchetype)
                ?.defined_pokemon ?? []
            }
          />
        ) : (
          <EditIcon />
        )}
      </Button>
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add archetype</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input placeholder='Filter archetype' onChange={handleFilterChange} />
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
            <ModalFooter>
              <Button colorScheme='blue' mr={3} type='submit'>
                Select deck
              </Button>
              <Button variant='ghost' onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Fragment>
  );
}
