import { EditIcon } from '@chakra-ui/icons';
import { IconButton, Stack, StackItem, useDisclosure } from '@chakra-ui/react';
import { Standing } from '../../../types/tournament';
import DeckInput from './DeckInput/DeckInput';
import { ListViewerOpenButton } from './ListViewer/ListViewerOpenButton';

export const DeckInfoDisplay = ({
  player,
  tournament,
  enableEdits,
  quickEdits,
}: {
  player: Standing;
  tournament: { id: string; name: string };
  enableEdits: boolean;
  quickEdits?: boolean;
}) => {
  const archetypeModal = useDisclosure();
  return (
    <Stack direction={'row'} padding={0} alignItems='center'>
      <StackItem width={'60px'}>
        <DeckInput
          tournamentId={tournament.id}
          playerName={player.name}
          deckName={player.deck?.name}
          quickEdit={enableEdits && !!quickEdits}
          archetypeModal={archetypeModal}
        />
      </StackItem>
      {player?.deck?.list ? (
        <ListViewerOpenButton result={player} />
      ) : enableEdits ? (
        <IconButton
          maxWidth={'2'}
          icon={<EditIcon />}
          aria-label='edit'
          variant={'ghost'}
          width={'100%'}
          size='xs'
          onClick={archetypeModal.onOpen}
        />
      ) : null}
    </Stack>
  );
};
