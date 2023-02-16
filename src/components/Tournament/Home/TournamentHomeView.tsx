import { Heading, Stack } from '@chakra-ui/react';
import { Tournament } from '../../../../types/tournament';
import { useStoredDecks } from '../../../hooks/finalResults';
import { TopDecks } from '../../Home/TopDecks';
import { TournamentStatusBadge } from '../../TournamentList/TournamentStatusBadge';
import { MyTournamentView } from './MyTournamentView';
import { PinnedPlayerList } from './PinnedPlayers/PinnedPlayerList';
import { TournamentHomeLinks } from './TournamentHomeLinks';

interface TournamentHomeViewProps {
  tournament: Tournament | null;
}

export const TournamentHomeView = (props: TournamentHomeViewProps) => {
  const decks = useStoredDecks({
    tournamentRange: [
      parseInt(props.tournament?.id as string),
      parseInt(props.tournament?.id as string),
    ],
  });

  if (!props.tournament) return null;

  return (
    <Stack padding={6} spacing={6}>
      <Stack spacing={6}>
        <Stack spacing={2}>
          <Heading size='xl' color='gray.700'>
            {props.tournament.name}
          </Heading>
          <TournamentStatusBadge tournament={props.tournament} size='md' />
        </Stack>
        <TournamentHomeLinks tournament={props.tournament} />
      </Stack>
      <PinnedPlayerList tournament={props.tournament} />
      <MyTournamentView tournament={props.tournament} />
      {decks && decks.length > 0 && <TopDecks tournament={props.tournament} />}
    </Stack>
  );
};
