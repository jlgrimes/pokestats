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
import { useEffect, useState } from 'react';
import { Card } from '../../../../types/tournament';
import { ordinalSuffixOf } from '../../../lib/strings';
import { ListView } from './ListView';

interface ListViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: Record<any, any>;
  tournamentName: string;
}

const ListModalBody = ({ list }: {list:  Record<string, Card[]> }) => {
  const [listGridHeight, setListGridHeight] = useState(0);
  console.log(listGridHeight)

  useEffect(() => {
    setListGridHeight(
      document.getElementById('list-view-modal-body')?.clientHeight ?? 0
    );
  }, []);

  return (
    <ModalBody padding={0} height='100%' id='list-view-modal-body'>
      <ListView deckList={list} containerHeight={listGridHeight} />
    </ModalBody>
  );
};

export const ListViewerModal = (props: ListViewerModalProps) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size='full'>
      <ModalOverlay />
      <ModalContent margin={{ base: '0', sm: '16' }}>
        <Stack spacing={0} padding={3}>
          <Heading size='md'>{props.result.deck.name}</Heading>
          <Text>
            {props.result.name} - {ordinalSuffixOf(props.result.placing)} @{' '}
            {props.tournamentName}
          </Text>
        </Stack>
        <ModalCloseButton />
        <ListModalBody list={props.result.deck.list} />
      </ModalContent>
    </Modal>
  );
};
