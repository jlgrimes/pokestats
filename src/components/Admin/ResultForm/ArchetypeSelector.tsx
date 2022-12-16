import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import supabase from '../../../lib/supabase/client';
import SpriteDisplay from '../../common/SpriteDisplay';

interface ArchetypeSelectorProps {
  value: string;
  onChange: (field: string, value: string) => void;
}

export default function ArchetypeSelector(props: ArchetypeSelectorProps) {
  const [selectedArchetype, setSelectedArchetype] = useState<string>('');

  const handleMenuItemClick = (deck: string) => {
    props.onChange('deck', deck);
    setSelectedArchetype(deck);
  };

  useEffect(() => {
    setSelectedArchetype(props.value);
  }, [props.value]);

  const fetchArchetypes = async () => {
    const res = await supabase.from('Deck Archetypes')
    .select('name,defined_pokemon');
    return res.data;
  };

  const { data: decks } = useQuery('decks', fetchArchetypes);

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant='outline'>
        {selectedArchetype.length > 0 ? <SpriteDisplay pokemonNames={selectedArchetype} /> : 'Select deck'}
      </MenuButton>
      <MenuList>
        {decks?.map(({ defined_pokemon }, idx) => (
          <MenuItem key={idx} onClick={() => handleMenuItemClick(defined_pokemon)}>
            <SpriteDisplay pokemonNames={defined_pokemon} />
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
