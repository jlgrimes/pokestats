import { Heading, Stack } from '@chakra-ui/react';
import { Tournament } from '../../../../types/tournament';
import { TopDecks } from '../../Home/TopDecks';
import { MyTournamentView } from './MyTournamentView';
import { PinnedPlayerList } from './PinnedPlayers/PinnedPlayerList';
import { TournamentHomeLinks } from './TournamentHomeLinks';

interface TournamentHomeViewProps {
  tournament: Tournament | null;
}

export const TournamentHomeView = (props: TournamentHomeViewProps) => {
  if (!props.tournament) return null;

  return (
    <Stack padding={6} spacing={6}>
      <Stack spacing={4}>
        <Heading size='xl' color='gray.700'>
          {props.tournament.name}
        </Heading>
        <TournamentHomeLinks tournament={props.tournament} />
      </Stack>
      <MyTournamentView tournament={props.tournament} />
      <PinnedPlayerList tournament={props.tournament} />
      <TopDecks tournament={props.tournament} />
    </Stack>
  );
};
