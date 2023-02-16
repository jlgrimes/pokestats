import { Stack } from '@chakra-ui/react';
import { Tournament } from '../../../../../types/tournament';
import { usePinnedPlayers } from '../../../../hooks/pinnedPlayers';
import { useLiveTournamentResults } from '../../../../hooks/tournamentResults';
import { PinnedPlayerCard } from './PinnedPlayerCard';

interface PinnedPlayerListProps {
  tournament: Tournament;
}

export const PinnedPlayerList = (props: PinnedPlayerListProps) => {
  const { data: pinnedPlayerNames } = usePinnedPlayers();
  const { data: liveTournamentResults } = useLiveTournamentResults(
    props.tournament.id
  );
  const pinnedPlayers = pinnedPlayerNames?.map(name =>
    liveTournamentResults?.data.find(liveResult => liveResult.name === name)
  );

  return (
    <Stack>
      {pinnedPlayers?.map(
        pinnedPlayer =>
          pinnedPlayer && (
            <PinnedPlayerCard
              key={`pinned-${pinnedPlayer?.name}`}
              player={pinnedPlayer}
              tournament={props.tournament}
            />
          )
      )}
    </Stack>
  );
};
