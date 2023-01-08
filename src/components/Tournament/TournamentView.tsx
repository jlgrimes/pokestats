import { Stack } from '@chakra-ui/react';
import { Tournament } from '../../../types/tournament';
import { useUserIsAdmin } from '../../hooks/administrators';
import { useLiveTournamentResults } from '../../hooks/tournamentResults';
import { StandingsList } from '../DataDisplay/Standings/StandingsList';

export default function TournamentView({
  tournament,
}: {
  tournament: Tournament;
}) {
  const { data: liveResults } = useLiveTournamentResults(tournament.id, {
    load: { allRoundData: true },
  });

  return (
    <Stack>
      {liveResults && (
        <StandingsList results={liveResults.data} tournament={tournament} />
      )}
    </Stack>
  );
}
