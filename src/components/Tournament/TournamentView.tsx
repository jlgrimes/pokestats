import { Stack } from '@chakra-ui/react';
import { Tournament } from '../../../types/tournament';
import { useLiveTournamentResults } from '../../hooks/tournamentResults';
import { StandingsList } from '../DataDisplay/StandingsList';

export default function TournamentView({
  tournament,
}: {
  tournament: Tournament;
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
