import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
  Stack,
  Heading,
  Text,
} from '@chakra-ui/react';
import { ListView } from './ListView';

interface ListViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: Record<any, any>;
}

export const ListViewerModal = (props: ListViewerModalProps) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size='xl'>
      <ModalOverlay />
      <ModalContent marginTop={{ base: '0', sm: '16' }}>
        <ModalHeader>{`${props.result.name} - ${props.result.deck.name}`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ListView deckList={props.result.deck.list} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
