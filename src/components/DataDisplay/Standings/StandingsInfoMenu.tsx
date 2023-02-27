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
import { useUserIsAdmin } from '../../../hooks/administrators';
import { OpponentRoundList } from './OpponentRoundList/OpponentRoundList';
import { AdminBadge } from '../../common/AdminBadge';

interface StandingsInfoMenuProps {
  tournament: Tournament;
  result: Standing;
  onEditOpen: () => void;
  enableEdits: boolean;
  shouldHideOpponentView?: boolean;
  onUnpinPlayer?: () => void;
}

export const StandingsInfoMenu = (props: StandingsInfoMenuProps) => {
  const { data: userIsAdmin } = useUserIsAdmin();

  const {
    isOpen: isListOpen,
    onOpen: onListOpen,
    onClose: onListClose,
  } = useDisclosure();
  const {
    isOpen: isOpponentsOpen,
    onOpen: onOpponentsOpen,
    onClose: onOpponentsClose,
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
          {props.result.deck?.list && (
            <MenuItem fontSize='lg' onClick={onListOpen}>
              View deck list
            </MenuItem>
          )}
          {!props.shouldHideOpponentView && (
            <MenuItem fontSize='lg' onClick={onOpponentsOpen}>
              View matchups
            </MenuItem>
          )}
          {props.onUnpinPlayer && (
            <MenuItem fontSize='lg' onClick={props.onUnpinPlayer}>
              Remove from favorites
            </MenuItem>
          )}
          {props.enableEdits && (
            <MenuItem fontSize='lg' onClick={props.onEditOpen}>
              Edit deck
              {userIsAdmin && <AdminBadge />}
            </MenuItem>
          )}
        </MenuList>
      </Menu>
      <ListViewerModal
        isOpen={isListOpen}
        onClose={onListClose}
        result={props.result}
        tournament={props.tournament}
      />
      <OpponentRoundList
        player={props.result}
        tournament={props.tournament}
        modalOpen={isOpponentsOpen}
        handleCloseModal={onOpponentsClose}
      />
    </Fragment>
  );
};
