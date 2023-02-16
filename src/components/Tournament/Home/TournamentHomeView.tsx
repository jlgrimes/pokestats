import { Heading, Stack } from '@chakra-ui/react';
import { Tournament } from '../../../../types/tournament';

interface TournamentHomeViewProps {
  tournament: Tournament | null;
}

export const TournamentHomeView = (props: TournamentHomeViewProps) => {
  if (!props.tournament) return null;

  return (
    <Stack paddingY={4} paddingX={6}>
      <Heading size='xl' color='gray.700'>
        {props.tournament.name}
      </Heading>
    </Stack>
  );
};
