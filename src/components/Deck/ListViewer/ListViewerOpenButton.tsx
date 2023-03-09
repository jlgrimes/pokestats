import { IconButton, useDisclosure } from '@chakra-ui/react';
import { FaListUl } from 'react-icons/fa';
import { Standing, Tournament } from '../../../../types/tournament';
import { ListViewerModal } from './ListViewerModal';

interface ListViewerOpenButtonProps {
  result: Standing;
  tournament: Tournament;
}

export const ListViewerOpenButton = (props: ListViewerOpenButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        aria-label='view-list'
        variant={'ghost'}
        onClick={e => {
          e.stopPropagation();
          onOpen();
        }}
        size='md'
        minWidth={6}
      >
        <FaListUl />
      </IconButton>
      {isOpen && (
        <ListViewerModal
          isOpen={isOpen}
          onClose={onClose}
          result={props.result}
          tournament={props.tournament}
        />
      )}
    </>
  );
};
