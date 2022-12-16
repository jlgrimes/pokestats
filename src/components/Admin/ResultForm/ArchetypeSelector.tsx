import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useState } from 'react';

interface ArchetypeSelectorProps {
  value: string;
  onChange: (field: string, value: string) => void;
}

export default function ArchetypeSelector(props: ArchetypeSelectorProps) {
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);

  const handleMenuItemClick = (deck: string) => {
    props.onChange('deck', deck);
    setSelectedArchetype(deck);
  }

  // TODO: replace with supabase
  const decks = ['Lugia', 'Lost box', 'Arceus Inteleon', 'Articuno Jelly'];

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant='outline'>
        {selectedArchetype ?? 'Select deck'}
      </MenuButton>
      <MenuList>
        {decks.map((deck, idx) => (
          <MenuItem key={idx} onClick={() => handleMenuItemClick(deck)}>
            {deck}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}
