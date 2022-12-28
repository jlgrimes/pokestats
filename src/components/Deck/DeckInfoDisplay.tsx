import { Stack } from '@chakra-ui/react';
import { Standing } from '../../../types/tournament';
import SpriteDisplay from '../common/SpriteDisplay';
import DeckInput from './DeckInput/DeckInput';
import { ListViewerOpenButton } from './ListViewer/ListViewerOpenButton';

export const DeckInfoDisplay = ({
  player,
  tournament,
}: {
  player: Standing;
  tournament: { id: string; name: string };
}) => {
  return (
    <Stack direction={'row'}>
      {!player?.deck?.list ? (
        <DeckInput
          tournamentId={tournament.id}
          playerName={player.name}
          deckName={player.deck?.name}
          quickEdit={false}
        />
      ) : (
        <SpriteDisplay pokemonNames={player?.deck?.defined_pokemon ?? []} />
      )}
      {player.deck.list && <ListViewerOpenButton result={player} />}
    </Stack>
  );
};
