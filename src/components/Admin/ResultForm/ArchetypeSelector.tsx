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
    .select('defined_pokemon');
    const data = res.data;
    return data?.map(({ defined_pokemon }) => defined_pokemon);
  };

  const { data: decks } = useQuery('decks', fetchArchetypes);
  console.log(decks)
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant='outline'>
        {selectedArchetype.length > 0 ? selectedArchetype : 'Select deck'}
      </MenuButton>
      <MenuList>
        {decks?.map((deck, idx) => (
          <MenuItem key={idx} onClick={() => handleMenuItemClick(deck)}>
            {deck}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
