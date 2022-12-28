import { EditIcon } from '@chakra-ui/icons';
import { IconButton, Stack, StackItem, useDisclosure } from '@chakra-ui/react';
import { Standing } from '../../../types/tournament';
import SpriteDisplay from '../common/SpriteDisplay';
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
  const { onOpen } = useDisclosure();
  return (
    <Stack direction={'row'}>
      <StackItem>
        <DeckInput
          tournamentId={tournament.id}
          playerName={player.name}
          deckName={player.deck?.name}
          quickEdit={!!quickEdits}
          openArchetypeSelectorModal={onOpen}
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
          onClick={onOpen}
        />
      ) : null}
    </Stack>
  );
};
