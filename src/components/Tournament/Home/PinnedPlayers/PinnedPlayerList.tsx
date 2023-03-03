import { Button, Grid, Stack, Icon, useDisclosure } from '@chakra-ui/react';
import { FaMapPin, FaPlus, FaStar, FaTwitter } from 'react-icons/fa';
import { Tournament } from '../../../../../types/tournament';
import { useFinalResults } from '../../../../hooks/finalResults';
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

  const { data: tournamentPerformance } = useFinalResults({
    tournamentId: props.tournament.id,
  });

  const { data: liveTournamentResults, isLoading } = useLiveTournamentResults(
    props.tournament.id,
    { load: { allRoundData: true } }
  );
  const pinnedPlayers = pinnedPlayerNames
    ?.map(name => {
      const finalStanding = tournamentPerformance?.find(
        standing => standing.name === name
      );
      const liveStanding = liveTournamentResults?.data.find(
        liveResult => liveResult.name === name
      );

      if (finalStanding && liveStanding) {
        if (
          !finalStanding.deck?.defined_pokemon &&
          liveStanding.deck?.defined_pokemon
        ) {
          return {
            ...finalStanding,
            deck: liveStanding.deck,
          };
        }
      }

      return finalStanding ?? liveStanding;
    })
    .sort((a, b) => {
      if (!a || !b) return 0;

      if (a.placing > b.placing) return 1;
      if (a.placing < b.placing) return -1;

      return 0;
    });
  const addPinPlayerModalControls = useDisclosure();

  return (
    <CommonCard
      header='Favorites'
      leftIcon={<Icon color='yellow.500' as={FaStar} />}
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
                shouldHideDecks={liveTournamentResults?.shouldHideDecks}
                isDeckLoading={isLoading && !pinnedPlayer.deck?.id}
              />
            )
        )}
        <Button
          variant='ghost'
          leftIcon={<FaPlus />}
          onClick={addPinPlayerModalControls.onOpen}
          isDisabled={props.tournament.tournamentStatus === 'not-started'}
          size={'sm'}
          colorScheme='blackAlpha'
        >
          Add favorite player
        </Button>
        <PinPlayerModal
          tournament={props.tournament}
          modalControls={addPinPlayerModalControls}
        />
      </Stack>
    </CommonCard>
  );
};
