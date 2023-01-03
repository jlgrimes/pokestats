import { IconButton, Stack, StackItem, useDisclosure } from '@chakra-ui/react';
import { FaRegEdit } from 'react-icons/fa';
import { Standing, Tournament } from '../../../types/tournament';
import DeckInput from './DeckInput/DeckInput';
import { ListViewerOpenButton } from './ListViewer/ListViewerOpenButton';

export const DeckInfoDisplay = ({
  player,
  tournament,
  enableEdits,
  shouldShowAsText,
}: {
  player: Standing;
  tournament: Tournament;
  enableEdits: boolean;
  shouldShowAsText?: boolean;
}) => {
  const archetypeModal = useDisclosure();
  return (
    <Stack direction={'row'} spacing={0} alignItems='center'>
      <StackItem width={shouldShowAsText ? 'auto' : '60px'}>
        <DeckInput
          tournamentId={tournament.id}
          playerName={player.name}
          deckName={player.deck?.name}
          quickEdit={false}
          archetypeModal={archetypeModal}
          shouldShowAsText={shouldShowAsText}
        />
      </StackItem>
      {player?.deck?.list ? (
        <ListViewerOpenButton
          result={player}
          tournamentName={tournament.name}
        />
      ) : enableEdits ? (
        <IconButton
          maxWidth={'2'}
          icon={<FaRegEdit />}
          aria-label='edit'
          variant={'ghost'}
          width={'100%'}
          size='sm'
          color='gray.500'
          onClick={archetypeModal.onOpen}
        />
      ) : null}
    </Stack>
  );
};
