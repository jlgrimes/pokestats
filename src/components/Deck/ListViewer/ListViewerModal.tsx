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
import { ordinalSuffixOf } from '../../../lib/strings';
import { ListView } from './ListView';

interface ListViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: Record<any, any>;
  tournamentName: string;
}

export const ListViewerModal = (props: ListViewerModalProps) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size='xl'>
      <ModalOverlay />
      <ModalContent marginTop={{ base: '0', sm: '16' }}>
        <Stack spacing={0} padding={3}>
          <Heading size='md'>{props.result.deck.name}</Heading>
          <Text>{props.result.name} - {ordinalSuffixOf(props.result.placing)} @ {props.tournamentName}</Text>
        </Stack>
        <ModalCloseButton />
        <ModalBody padding={0}>
          <ListView deckList={props.result.deck.list} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
