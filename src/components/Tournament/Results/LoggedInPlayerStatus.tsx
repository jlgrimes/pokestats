import { Table } from '@chakra-ui/react';
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
  return loggedInPlayerLiveResults && (
    <Table>
      <ResultsRow
        result={loggedInPlayerLiveResults}
        tournament={tournament}
        // Always allow player to edit their own deck
        allowEdits={true}
        tournamentFinished={tournamentFinished}
      />
    </Table>
  );
};