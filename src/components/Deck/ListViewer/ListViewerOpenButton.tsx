import { IconButton, useDisclosure } from '@chakra-ui/react';
import { FaList } from 'react-icons/fa';
import { ListViewerModal } from './ListViewerModal';

interface ListViewerOpenButtonProps {
  result: Record<string, any>;
}

export const ListViewerOpenButton = (props: ListViewerOpenButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <IconButton
        aria-label='view-list'
        variant={'ghost'}
        size='xs'
        onClick={onOpen}
      >
        <FaList />
      </IconButton>
      {isOpen && <ListViewerModal isOpen={isOpen} onClose={onClose} result={props.result} />}
    </>
  );
};
