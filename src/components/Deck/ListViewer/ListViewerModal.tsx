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
import { useRouter } from 'next/router';
import { memo, useCallback, useEffect, useState } from 'react';
import {
  Card,
  DeckList,
  Standing,
  Tournament,
} from '../../../../types/tournament';
import { ordinalSuffixOf } from '../../../lib/strings';
import { shortenTournamentName } from '../../../lib/tournament';
import { CardViewerBody } from './CardViewer.tsx/CardViewerBody';
import { getCardSlug } from './helpers';
import { ListView } from './ListView';

interface ListViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: Standing;
  tournament: Tournament;
}

const ListModalBody = ({
  list,
  handleCardClick,
}: {
  list: DeckList;
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
  const router = useRouter();

  // const handleCardClick = useCallback((card: Card) => {
  //   router.push(`/decks/${props.result.deck?.id}/${getCardSlug(card)}`);
  // }, []);

  const handleCardClick = useCallback(
    (card: Card) => {
      setSelectedCard(card);
    },
    [setSelectedCard]
  );

  const handleCardClear = useCallback(() => {
    setSelectedCard(null);
  }, [setSelectedCard]);

  if (!props.result.deck?.list) return null;

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
                {shortenTournamentName(props.tournament)}
              </Text>
            </Stack>
          </Stack>
        )}
        {selectedCard ? (
          <CardViewerBody
            card={selectedCard}
            clearSelectedCard={handleCardClear}
            tournament={props.tournament}
            deck={props.result.deck}
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
