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
  Box,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { memo, useCallback, useEffect, useState } from 'react';
import {
  DeckCard,
  DeckList,
  Standing,
  Tournament,
} from '../../../../types/tournament';
import { ordinalSuffixOf } from '../../../lib/strings';
import { AppLogo } from '../../Layout/AppBar/AppLogo';
import { ListView } from './ListView';

interface ListViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: Standing;
  tournament: Tournament;
}

const ListModalBody = ({
  list,
}: {
  list: DeckList;
}) => {
  const [listGridHeight, setListGridHeight] = useState(0);

  useEffect(() => {
    const height = document.getElementById(
      'list-view-modal-body'
    )?.clientHeight;
    setListGridHeight(height ? height - 4 : 0);
  }, []);

  return (
    <ModalBody
      padding={'3px 0 0'}
      minHeight={{ base: '100%', md: '600px' }}
      id='list-view-modal-body'
    >
      <ListView
        deckList={list}
        containerHeight={listGridHeight}
      />
    </ModalBody>
  );
};

export const ListViewerModal = memo((props: ListViewerModalProps) => {
  const [selectedCard, setSelectedCard] = useState<DeckCard | null>(null);
  const router = useRouter();

  // const handleCardClick = useCallback((card: Card) => {
  //   router.push(`/decks/${props.result.deck?.id}/${getCardSlug(card)}`);
  // }, []);

  if (!props.result.deck_archetype || !props.result.decklist) return null;

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      size={{ base: 'full', md: 'xl' }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
          <Stack
            direction='row'
            justifyContent='space-between'
            alignItems={'center'}
          >
            <Stack spacing={0} padding={3}>
              <Heading size='md'>{props.result.deck_archetype.name ?? 'Other'}</Heading>
              <Text>
                {props.result.name} - {ordinalSuffixOf(props.result.placing)} @{' '}
                {props.tournament.name}
              </Text>
            </Stack>
          </Stack>
          <ListModalBody
            list={props.result.decklist}
          />
        <Box paddingX={3}>
          <AppLogo smol />
        </Box>
      </ModalContent>
    </Modal>
  );
});

ListViewerModal.displayName = 'ListViewerModal';
