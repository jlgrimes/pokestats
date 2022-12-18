import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@chakra-ui/react';
import { Fragment, useEffect, useState } from 'react';
import { useArchetypes } from '../../../hooks/deckArchetypes';
import SpriteAndNameDisplay from '../../common/SpriteAndNameDisplay';
import SpriteDisplay from '../../common/SpriteDisplay';
import AddArchetypeModal from './AddArchetypeModal';

interface ArchetypeSelectorProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function ArchetypeSelector(props: ArchetypeSelectorProps) {
  const [selectedArchetype, setSelectedArchetype] = useState<string>('');
  const {
    isOpen: isAddModalOpen,
    onOpen: openAddModal,
    onClose: closeAddModal,
  } = useDisclosure();

  const handleArchetypeChange = (deck: string) => {
    props.onChange(deck);
    setSelectedArchetype(deck);
  };

  useEffect(() => {
    if (props.value) {
      setSelectedArchetype(props.value);
    }
  }, [props.value]);

  const { data: decks } = useArchetypes();

  return (
    <Fragment>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          variant='outline'
          width={'100%'}
        >
          {selectedArchetype.length > 0 ? (
            <SpriteDisplay
              pokemonNames={
                decks?.find(deck => deck.name === selectedArchetype)
                  ?.defined_pokemon ?? []
              }
            />
          ) : (
            'Select deck'
          )}
        </MenuButton>
        <MenuList>
          {decks?.map(({ name, defined_pokemon }, idx) => (
            <MenuItem key={idx} onClick={() => handleArchetypeChange(name)}>
              <SpriteAndNameDisplay
                archetypeName={name}
                pokemonNames={defined_pokemon}
              />
            </MenuItem>
          ))}
          <MenuItem onClick={openAddModal}>Add Archetype</MenuItem>
        </MenuList>
      </Menu>
      <AddArchetypeModal isOpen={isAddModalOpen} onClose={closeAddModal} handleArchetypeChange={handleArchetypeChange} />
    </Fragment>
  );
}
