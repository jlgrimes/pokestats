import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  StackItem,
} from '@chakra-ui/react';
import { FaFilter, FaSearch } from 'react-icons/fa';

export const FilterMenu = ({ children }: { children: JSX.Element }) => {
  return (
    <Stack paddingLeft={4} justifyContent='end'>
      <Menu closeOnSelect={false} placement='top'>
        <MenuButton
          as={IconButton}
          colorScheme='blue'
          icon={<FaSearch />}
          isRound
          size='lg'
        />
        <MenuList minWidth='240px' marginRight='0.5'>
          {children}
        </MenuList>
      </Menu>
    </Stack>
  );
};
