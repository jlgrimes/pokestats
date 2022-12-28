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
import DeckInput from './ResultsList/DeckInput/DeckInput';
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
    <TableContainer padding={'0 0.5rem'}>
      <Table size='sm' variant={'unstyled'}>
        <Tr>
          <Td>
            <Text>{playerResults.placing}</Text>
          </Td>
          <Td>
            <Player
              name={playerResults.name}
              profile={playerResults.profile}
              isEditable={false}
            />
          </Td>
          <Td>
            <Text>{formatRecord(playerResults.record)}</Text>
          </Td>
          <DeckInput
            tournamentId={tournament.id}
            playerName={playerResults.name}
            deckName={playerResults.deck?.name}
            quickEdit={false}
          />
        </Tr>
      </Table>
    </TableContainer>
  ) : (
    <></>
  );
};
