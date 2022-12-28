import {
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
} from '@chakra-ui/react';
import { useLoggedInPlayerLiveResults } from '../../../hooks/tournamentResults';
import DeckInput from '../../Deck/DeckInput/DeckInput';
import { formatRecord } from './ResultsList/helpers';
import { Player } from './ResultsList/Player/Player';
import { ResultsRow } from './ResultsList/ResultsRow';

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
      <DeckInput
        tournamentId={tournament.id}
        playerName={playerResults.name}
        deckName={playerResults.deck?.name}
        quickEdit={false}
      />
    </Stack>
  ) : (
    <></>
  );
};
