import { Badge, Heading, HStack, Stack } from '@chakra-ui/react';
import { Tournament } from '../../../../types/tournament';
import { useStoredDecks } from '../../../hooks/finalResults';
import { useLocation } from '../../../hooks/tournamentMetadata';
import { OpenEditTournamentInfo } from '../../Admin/EditTournamentInfo/OpenEditTournamentInfo';
import { TopDecks } from '../../Home/TopDecks';
import { TournamentStatusBadge } from '../../TournamentList/TournamentStatusBadge';
import { CountryFlag } from './CountryFlag';
import { MyTournamentView } from './MyTournamentView';
import { PinnedPlayerList } from './PinnedPlayers/PinnedPlayerList';
import { TournamentHomeLinks } from './TournamentHomeLinks';

interface TournamentHomeViewProps {
  tournament: Tournament | null;
}

export const TournamentHomeView = (props: TournamentHomeViewProps) => {
  const { data: location } = useLocation(props.tournament?.id ?? '');
  const decks = useStoredDecks({
    tournamentRange: [
      parseInt(props.tournament?.id as string),
      parseInt(props.tournament?.id as string),
    ],
  });
  const country = location?.address_components?.find(({ types }) =>
    types.includes('country')
  )?.short_name;

  if (!props.tournament) return null;

  return (
    <Stack padding={6} spacing={6}>
      <Stack spacing={6}>
        <Stack spacing={2}>
          <Heading size='xl' color='gray.700'>
            {props.tournament.name}
          </Heading>
          {location && country && (
            <HStack spacing='4'>
              <CountryFlag countryCode={country} />
            </HStack>
          )}
          <HStack>
            <TournamentStatusBadge tournament={props.tournament} size='md' />
            <OpenEditTournamentInfo tournament={props.tournament} />
          </HStack>
        </Stack>
        <TournamentHomeLinks tournament={props.tournament} />
      </Stack>
      <PinnedPlayerList tournament={props.tournament} />
      <MyTournamentView tournament={props.tournament} />
      {decks && decks.length > 0 && <TopDecks tournament={props.tournament} />}
    </Stack>
  );
};
