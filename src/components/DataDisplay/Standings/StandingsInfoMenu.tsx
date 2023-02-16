import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Badge,
  useDisclosure,
} from '@chakra-ui/react';
import { Fragment } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { ListViewerModal } from '../../Deck/ListViewer/ListViewerModal';
import type { Standing, Tournament } from '../../../../types/tournament';

interface StandingsInfoMenuProps {
  tournament: Tournament;
  result: Standing;
}

export const StandingsInfoMenu = (props: StandingsInfoMenuProps) => {
  const {
    isOpen: isListOpen,
    onOpen: onListOpen,
    onClose: onListClose,
  } = useDisclosure();

  return (
    <Fragment>
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
          <MenuItem fontSize='lg' onClick={onListOpen}>
            View Deck List
          </MenuItem>
          <MenuItem fontSize='lg'>View Player Matchups</MenuItem>
          <MenuItem fontSize='lg'>
            Edit Deck
            <Badge colorScheme={'cyan'} marginLeft={2}>
              God
            </Badge>
          </MenuItem>
        </MenuList>
      </Menu>
      <ListViewerModal
        isOpen={isListOpen}
        onClose={onListClose}
        result={props.result}
        tournament={props.tournament}
      />
    </Fragment>
  );
};
