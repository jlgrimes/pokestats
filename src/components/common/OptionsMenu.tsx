import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  StackItem,
} from '@chakra-ui/react';
import { FaCog } from 'react-icons/fa';

export const OptionsMenu = ({ children }: { children: JSX.Element }) => {
  return (
    <StackItem>
      <Menu closeOnSelect={false}>
        <MenuButton
          as={Button}
          colorScheme='gray'
          variant='outline'
          size='sm'
          leftIcon={<FaCog />}
        >
          Options
        </MenuButton>
        <MenuList minWidth='240px' marginRight='0.5'>
          {children}
        </MenuList>
      </Menu>
    </StackItem>
  );
};
