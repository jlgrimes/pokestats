import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  StackItem,
} from '@chakra-ui/react';
import { FaFilter } from 'react-icons/fa';

export const FilterMenu = ({ children }: { children: JSX.Element }) => {
  return (
    <StackItem paddingLeft={4}>
      <Menu closeOnSelect={false}>
        <MenuButton
          as={Button}
          colorScheme='gray'
          variant='outline'
          size='sm'
          leftIcon={<FaFilter />}
        >
          Filter
        </MenuButton>
        <MenuList minWidth='240px' marginRight='0.5'>
          {children}
        </MenuList>
      </Menu>
    </StackItem>
  );
};
