import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { Fragment, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import supabase from '../../../lib/supabase/client';
import SpriteAndNameDisplay from '../../common/SpriteAndNameDisplay';
import SpriteDisplay from '../../common/SpriteDisplay';
import AddArchetypeModal from './AddArchetypeModal';

interface ArchetypeSelectorProps {
  value: string;
  onChange: (field: string, value: string) => void;
}

export default function ArchetypeSelector(props: ArchetypeSelectorProps) {
  const [selectedArchetype, setSelectedArchetype] = useState<string>('');
  const {
    isOpen: isAddModalOpen,
    onOpen: openAddModal,
    onClose: closeAddModal,
  } = useDisclosure();

  const handleMenuItemClick = (deck: string) => {
    props.onChange('deck', deck);
    setSelectedArchetype(deck);
  };

  useEffect(() => {
    setSelectedArchetype(props.value);
  }, [props.value]);

  const fetchArchetypes = async () => {
    const res = await supabase
      .from('Deck Archetypes')
      .select('name,defined_pokemon');
    return res.data;
  };

  const { data: decks } = useQuery('decks', fetchArchetypes);

  return (
    <Fragment>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          variant='outline'
        >
          {selectedArchetype.length > 0 ? (
            <SpriteAndNameDisplay
              archetypeName={selectedArchetype}
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
            <MenuItem key={idx} onClick={() => handleMenuItemClick(name)}>
              <SpriteAndNameDisplay
                archetypeName={name}
                pokemonNames={defined_pokemon}
              />
            </MenuItem>
          ))}
          <MenuItem onClick={openAddModal}>Add Archetype</MenuItem>
        </MenuList>
      </Menu>
      <AddArchetypeModal isOpen={isAddModalOpen} onClose={closeAddModal} />
    </Fragment>
  );
}
