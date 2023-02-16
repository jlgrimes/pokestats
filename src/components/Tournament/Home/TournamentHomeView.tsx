import { Heading, Stack } from '@chakra-ui/react';
import { Tournament } from '../../../../types/tournament';
import { MyTournamentView } from './MyTournamentView';
import { TournamentHomeLinks } from './TournamentHomeLinks';

interface TournamentHomeViewProps {
  tournament: Tournament | null;
}

export const TournamentHomeView = (props: TournamentHomeViewProps) => {
  if (!props.tournament) return null;

  return (
    <Stack paddingY={4}>
      <Heading size='xl' color='gray.700' paddingX={6}>
        {props.tournament.name}
      </Heading>
      <TournamentHomeLinks tournament={props.tournament} />
      <MyTournamentView tournament={props.tournament} />
    </Stack>
  );
};
