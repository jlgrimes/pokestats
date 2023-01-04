import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Stack,
  Heading,
  Text,
  CloseButton,
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

const ListModalBody = ({ list }: { list: Record<string, Card[]> }) => {
  const [listGridHeight, setListGridHeight] = useState(0);

  useEffect(() => {
    const height = document.getElementById(
      'list-view-modal-body'
    )?.clientHeight;
    setListGridHeight(height ? height - 4 : 0);
  }, []);

  return (
    <ModalBody padding={'3px 0 0'} height='100%' id='list-view-modal-body'>
      <ListView deckList={list} containerHeight={listGridHeight} />
    </ModalBody>
  );
};

export const ListViewerModal = (props: ListViewerModalProps) => {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size='full'>
      <ModalOverlay />
      <ModalContent>
        <ListModalBody list={props.result.deck.list} />
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems={'center'}
        >
          <Stack spacing={0} padding={3}>
            <Heading size='md'>{props.result.deck.name ?? 'Other'}</Heading>
            <Text>
              {props.result.name} - {ordinalSuffixOf(props.result.placing)} @{' '}
              {props.tournamentName}
            </Text>
          </Stack>
          <CloseButton onClick={props.onClose} paddingRight={4} />
        </Stack>
      </ModalContent>
    </Modal>
  );
};
