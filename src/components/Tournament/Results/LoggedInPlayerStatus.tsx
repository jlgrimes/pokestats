import {
  Stack,
  Text,
} from '@chakra-ui/react';
import { useLoggedInPlayerLiveResults } from '../../../hooks/tournamentResults';
import { DeckInfoDisplay } from '../../Deck/DeckInfoDisplay';
import { formatRecord } from './ResultsList/helpers';

export const LoggedInPlayerStatus = ({
  tournament,
  tournamentFinished,
}: {
  tournament: { id: string; name: string };
  tournamentFinished: boolean;
}) => {
  const playerResults = useLoggedInPlayerLiveResults(tournament.id);
  return playerResults ? (
    <Stack>
      <Text>{playerResults.placing}</Text>
      <Text>{formatRecord(playerResults.record)}</Text>
      <DeckInfoDisplay
        tournament={tournament}
        player={playerResults}
        enableEdits={true}
        quickEdits={false}
      />
    </Stack>
  ) : (
    <></>
  );
};
