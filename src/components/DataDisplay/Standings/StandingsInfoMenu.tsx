import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Badge,
} from '@chakra-ui/react';
import { FaEllipsisV } from 'react-icons/fa';

export const StandingsInfoMenu = () => {
  return (
    <Menu autoSelect={false} isLazy>
      <MenuButton
        as={IconButton}
        aria-label='view-info'
        variant={'ghost'}
        size='md'
        minWidth={6}
      >
        <FaEllipsisV />
      </MenuButton>
      <MenuList>
        <MenuItem fontSize='lg'>View Deck List</MenuItem>
        <MenuItem fontSize='lg'>View Player Matchups</MenuItem>
        <MenuItem fontSize='lg'>
          Edit Deck
          <Badge colorScheme={'cyan'} marginLeft={2}>
            God
          </Badge>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
