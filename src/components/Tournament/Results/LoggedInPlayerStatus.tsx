import { Table, Tbody } from '@chakra-ui/react';
import { useLoggedInPlayerLiveResults } from '../../../hooks/tournamentResults';
import { ResultsRow } from './ResultsList/ResultsRow';

export const LoggedInPlayerStatus = ({
  tournament,
  tournamentFinished,
}: {
  tournament: { id: string; name: string };
  tournamentFinished: boolean;
}) => {
  const loggedInPlayerLiveResults = useLoggedInPlayerLiveResults(tournament.id);
  return loggedInPlayerLiveResults ? (
    <Table>
      <Tbody>
        <ResultsRow
          result={loggedInPlayerLiveResults}
          tournament={tournament}
          // Always allow player to edit their own deck
          allowEdits={{
            player: false,
            deck: true,
          }}
          tournamentFinished={tournamentFinished}
          view='standings'
        />
      </Tbody>
    </Table>
  ) : (
    <></>
  );
};
