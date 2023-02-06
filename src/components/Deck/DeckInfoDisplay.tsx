import { IconButton, Stack, StackItem, useDisclosure } from '@chakra-ui/react';
import { memo } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { Standing, Tournament } from '../../../types/tournament';
import DeckInput from './DeckInput/DeckInput';
import { ListViewerOpenButton } from './ListViewer/ListViewerOpenButton';

export const DeckInfoDisplay = memo(
  ({
    player,
    tournament,
    enableEdits,
    shouldShowAsText,
    disableList,
    shouldHideDeck,
    shouldHideVerifiedIcon
  }: {
    player: Standing;
    tournament: Tournament;
    enableEdits: boolean;
    shouldShowAsText?: boolean;
    disableList?: boolean;
    shouldHideDeck?: boolean;
    shouldHideVerifiedIcon?: boolean
  }) => {
    const archetypeModal = useDisclosure();
    return (
      <Stack direction={'row'} spacing={0} alignItems='center'>
        <StackItem>
          <DeckInput
            tournamentId={tournament.id}
            playerName={player.name}
            deck={player.deck}
            archetypeModal={archetypeModal}
            shouldShowAsText={shouldShowAsText}
            shouldHideDeck={shouldHideDeck}
            shouldHideVerifiedIcon={shouldHideVerifiedIcon}
          />
        </StackItem>
        {player?.deck?.list && !disableList && (
          <ListViewerOpenButton result={player} tournament={tournament} />
        )}
        {enableEdits && (
          <IconButton
            maxWidth={'2'}
            icon={<FaRegEdit />}
            aria-label='edit'
            variant={'ghost'}
            width={'100%'}
            size='sm'
            color='gray.500'
            paddingRight={4}
            onClick={archetypeModal.onOpen}
          />
        )}
      </Stack>
    );
  }
);

DeckInfoDisplay.displayName = 'DeckInfoDisplay';
