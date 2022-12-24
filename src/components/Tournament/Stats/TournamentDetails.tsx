import { Heading, Stack, Text } from '@chakra-ui/react';
import { useLiveTournamentResults } from '../../../hooks/tournamentResults';

export const TournamentDetails = ({
  tournament,
}: {
  tournament: Record<string, string>;
}) => {
  const { data: liveTournamentResults } = useLiveTournamentResults(
    tournament.id
  );
  return (
    <Stack padding={'1rem 1.5rem'}>
      <Heading color='gray.700' size={'sm'}>
        Tournament Details
      </Heading>
      <Text>{liveTournamentResults?.numPlayers} players</Text>
    </Stack>
  );
};
