import { Button, Stack } from '@chakra-ui/react';
import { FaMapPin, FaPlus, FaStar } from 'react-icons/fa';
import { Tournament } from '../../../../../types/tournament';
import { usePinnedPlayers } from '../../../../hooks/pinnedPlayers';
import { useLiveTournamentResults } from '../../../../hooks/tournamentResults';
import { CommonCard } from '../../../common/CommonCard';
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
    <CommonCard
      ghost
    >
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
        <Button leftIcon={<FaMapPin />}>Pin a player</Button>
      </Stack>
    </CommonCard>
  );
};
