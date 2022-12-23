import { Heading, Stack, Text } from '@chakra-ui/react';
import { useLiveTournamentResults } from '../../hooks/tournamentResults';
import NotablePlayers from './NotablePlayers/NotablePlayers';
import ResultsList from './Results/ResultsList/ResultsList';

export default function Tournament({
  tournament,
  allowEdits,
}: {
  tournament: { id: string; name: string };
  allowEdits: boolean;
}) {
  const { data: liveResults, isLoading } = useLiveTournamentResults(tournament.id);
  return (
    <Stack>
      <Stack padding={'0.5rem 1.5rem'} spacing={0}>
        <Text>Live Standings{!isLoading && ` - Round ${liveResults?.roundNumber}`}</Text>
      </Stack>
      {/* <NotablePlayers tournament={tournament.name} allowEdits={allowEdits} /> */}
      <ResultsList tournament={tournament} allowEdits={allowEdits} liveResults={liveResults?.data} />
    </Stack>
  );
}
