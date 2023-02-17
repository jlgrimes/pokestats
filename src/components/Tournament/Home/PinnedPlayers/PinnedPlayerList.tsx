import { Button, Stack, useDisclosure } from '@chakra-ui/react';
import { FaMapPin, FaPlus, FaStar } from 'react-icons/fa';
import { Tournament } from '../../../../../types/tournament';
import { usePinnedPlayers } from '../../../../hooks/pinnedPlayers';
import { useLiveTournamentResults } from '../../../../hooks/tournamentResults';
import { CommonCard } from '../../../common/CommonCard';
import { PinnedPlayerCard } from './PinnedPlayerCard';
import { PinPlayerModal } from './PinPlayerModal';

interface PinnedPlayerListProps {
  tournament: Tournament;
}

export const PinnedPlayerList = (props: PinnedPlayerListProps) => {
  const { data: pinnedPlayerNames } = usePinnedPlayers(props.tournament.id);
  const { data: liveTournamentResults } = useLiveTournamentResults(
    props.tournament.id,
    { load: { allRoundData: true } }
  );
  const pinnedPlayers = pinnedPlayerNames
    ?.map(name =>
      liveTournamentResults?.data.find(liveResult => liveResult.name === name)
    )
    .sort((a, b) => {
      if (!a || !b) return 0;

      if (a.placing > b.placing) return 1;
      if (a.placing < b.placing) return -1;

      return 0;
    });
  const addPinPlayerModalControls = useDisclosure();

  return (
    <CommonCard ghost>
      <Stack>
        {pinnedPlayers?.map(
          pinnedPlayer =>
            pinnedPlayer && (
              <PinnedPlayerCard
                key={`pinned-${pinnedPlayer?.name}`}
                player={pinnedPlayer}
                tournament={props.tournament}
                shouldHideDecks={liveTournamentResults?.shouldHideDecks}
              />
            )
        )}
        <Button
          leftIcon={<FaMapPin />}
          onClick={addPinPlayerModalControls.onOpen}
          isDisabled={props.tournament.tournamentStatus === 'not-started'}
        >
          Pin a player
        </Button>
        <PinPlayerModal
          tournament={props.tournament}
          modalControls={addPinPlayerModalControls}
        />
      </Stack>
    </CommonCard>
  );
};
