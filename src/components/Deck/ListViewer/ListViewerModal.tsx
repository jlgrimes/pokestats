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
import { memo, useCallback, useEffect, useState } from 'react';
import { Card } from '../../../../types/tournament';
import { ordinalSuffixOf } from '../../../lib/strings';
import { CardViewerBody } from './CardViewer.tsx/CardViewerBody';
import { ListView } from './ListView';

interface ListViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: Record<any, any>;
  tournamentName: string;
}

const ListModalBody = ({
  list,
  handleCardClick,
}: {
  list: Record<string, Card[]>;
  handleCardClick: (card: Card) => void;
}) => {
  const [listGridHeight, setListGridHeight] = useState(0);

  useEffect(() => {
    const height = document.getElementById(
      'list-view-modal-body'
    )?.clientHeight;
    setListGridHeight(height ? height - 4 : 0);
  }, []);

  return (
    <ModalBody padding={'3px 0 0'} height='100%' id='list-view-modal-body'>
      <ListView
        deckList={list}
        containerHeight={listGridHeight}
        handleCardClick={handleCardClick}
      />
    </ModalBody>
  );
};

export const ListViewerModal = memo((props: ListViewerModalProps) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const handleCardClick = useCallback(
    (card: Card) => {
      setSelectedCard(card);
    },
    [setSelectedCard]
  );

  const handleCardClear = useCallback(() => {
    setSelectedCard(null);
  }, [setSelectedCard]);

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} size='full'>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        {!selectedCard && (
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
          </Stack>
        )}
        {selectedCard ? (
          <CardViewerBody
            card={selectedCard}
            clearSelectedCard={handleCardClear}
          />
        ) : (
          <ListModalBody
            list={props.result.deck.list}
            handleCardClick={handleCardClick}
          />
        )}
      </ModalContent>
    </Modal>
  );
});

ListViewerModal.displayName = 'ListViewerModal';
