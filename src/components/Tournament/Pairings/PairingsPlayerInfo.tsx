import { Stack, StackItem, Text } from '@chakra-ui/react';
import { Standing, Tournament } from '../../../../types/tournament';
import { DeckInfoDisplay } from '../../Deck/DeckInfoDisplay';

export const PairingsPlayerInfo = ({
  player,
  tournament,
  isUserAdmin,
}: {
  player: Standing;
  tournament: Tournament;
  isUserAdmin: boolean;
}) => {
  return (
    <Stack>
      <Text>{player.name}</Text>
      <StackItem paddingX={1}>
        <DeckInfoDisplay
          player={player}
          tournament={tournament}
          enableEdits={isUserAdmin}
        />
      </StackItem>
    </Stack>
  );
};
