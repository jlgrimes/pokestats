import { Stack } from '@chakra-ui/react';
import { useLiveTournamentResults } from '../../hooks/tournamentResults';
import { StandingsList } from '../DataDisplay/StandingsList';

export default function Tournament({
  tournament,
}: {
  tournament: { id: string; name: string };
}) {
  const { data: liveResults } = useLiveTournamentResults(tournament.id);

  return (
    <Stack>
      {liveResults && (
        <StandingsList
          results={liveResults.data}
          tournament={tournament}
          tournamentFinished={!liveResults.live}
        />
      )}
    </Stack>
  );
}
