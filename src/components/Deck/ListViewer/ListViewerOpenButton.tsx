import { IconButton, useDisclosure } from '@chakra-ui/react';
import { FaListUl } from 'react-icons/fa';
import { ListViewerModal } from './ListViewerModal';

interface ListViewerOpenButtonProps {
  result: Record<string, any>;
  tournamentName: string;
}

export const ListViewerOpenButton = (props: ListViewerOpenButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        aria-label='view-list'
        variant={'ghost'}
        onClick={onOpen}
        size='sm'

      >
        <FaListUl />
      </IconButton>
      {isOpen && (
        <ListViewerModal
          isOpen={isOpen}
          onClose={onClose}
          result={props.result}
          tournamentName={props.tournamentName}
        />
      )}
    </>
  );
};
