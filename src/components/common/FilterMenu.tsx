import {
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  StackItem,
} from '@chakra-ui/react';
import { FaFilter } from 'react-icons/fa';

export const FilterMenu = ({ children }: { children: JSX.Element }) => {
  return (
    <Stack paddingLeft={4} justifyContent='end'>
      <Menu closeOnSelect={false} placement='top'>
        <MenuButton
          as={Button}
          colorScheme='red'
          background='red.600'
          leftIcon={<FaFilter />}
          size='md'
          boxShadow={'md'}
          borderRadius={12}
        >
          Filter
        </MenuButton>
        <MenuList minWidth='240px' marginRight='0.5' maxWidth='100vw'>
          {children}
        </MenuList>
      </Menu>
    </Stack>
  );
};
