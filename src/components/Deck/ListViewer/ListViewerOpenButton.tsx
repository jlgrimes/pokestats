import {
  IconButton,
  Image,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import * as ReactDOM from 'react-dom';
import { IconCards } from '@tabler/icons-react';
import { Standing, Tournament } from '../../../../types/tournament';
import { ListViewerModal } from './ListViewerModal';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface ListViewerOpenButtonProps {
  result: Standing;
  tournament: Tournament;
}

export const ListViewerOpenButton = (props: ListViewerOpenButtonProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: imageOpen,
    onOpen: onImageOpen,
    onClose: onImageClose,
  } = useDisclosure();

  return (
    <>
      <IconButton
        aria-label='view-list'
        variant={'unstyled'}
        onClick={e => {
          e.stopPropagation();

          if (props.result.deck?.listImagePath) {
            onImageOpen();
          } else {
            onOpen();
          }
        }}
        minWidth={0}
      >
        <IconCards size={18} />
      </IconButton>
      <Modal
        isOpen={imageOpen}
        onClose={onImageClose}
        size='4xl'
        allowPinchZoom
        blockScrollOnMount={false}
      >
        <ModalOverlay />
        <ModalContent>
          <Image
            src={`https://keujidcnlmekgfajgnjq.supabase.co/storage/v1/object/public/uploaded-deck-lists/${props.result.deck?.listImagePath}`}
            alt='deck list'
          />
        </ModalContent>
      </Modal>
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
