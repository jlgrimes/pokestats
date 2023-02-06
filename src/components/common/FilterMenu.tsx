import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  StackItem,
} from '@chakra-ui/react';
import { FaFilter, FaSearch } from 'react-icons/fa';

export const FilterMenu = ({ children }: { children: JSX.Element }) => {
  return (
    <StackItem paddingLeft={4}>
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
    </StackItem>
  );
};
