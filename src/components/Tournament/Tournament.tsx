import { Stack } from '@chakra-ui/react';
import { useLiveTournamentResults } from '../../hooks/tournamentResults';
import { LoggedInPlayerStatus } from './Results/LoggedInPlayerStatus';
import ResultsList from './Results/ResultsList/ResultsList';

export default function Tournament({
  tournament,
}: {
  tournament: { id: string; name: string };
}) {
  const { data: liveResults } = useLiveTournamentResults(tournament.id);

  return (
    <Stack>
      {/* <NotablePlayers tournament={tournament.name} allowEdits={allowEdits} /> */}
      <LoggedInPlayerStatus
        tournament={tournament}
        tournamentFinished={!liveResults?.live}
      />
      {liveResults && (
        <ResultsList
          tournament={tournament}
          liveResults={liveResults.data}
          tournamentFinished={!liveResults.live}
        />
      )}
    </Stack>
  );
}
