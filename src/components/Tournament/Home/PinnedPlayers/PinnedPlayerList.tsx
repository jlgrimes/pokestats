import {
  Button,
  Grid,
  Stack,
  Icon,
  useDisclosure,
  HStack,
  Box,
  Flex,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import {
  FaHeart,
  FaMapPin,
  FaPlus,
  FaRegEdit,
  FaStar,
  FaTwitter,
} from 'react-icons/fa';
import { Tournament } from '../../../../../types/tournament';
import { useFinalResults } from '../../../../hooks/finalResults';
import { usePinnedPlayers } from '../../../../hooks/pinnedPlayers';
import { useLiveTournamentResults } from '../../../../hooks/tournamentResults';
import { CommonCard } from '../../../common/CommonCard';
import { ComponentLoader } from '../../../common/ComponentLoader';
import { PinnedPlayerCard } from './PinnedPlayerCard';
import { PinPlayerModal } from './PinPlayerModal';

interface PinnedPlayerListProps {
  tournament: Tournament;
  isCompact?: boolean;
}

export const PinnedPlayerList = (props: PinnedPlayerListProps) => {
  const session = useSession();
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
  const editPinnedPlayers = useDisclosure();

  return (
    <CommonCard
      header='Favorites'
      leftIcon={<Icon color='pink.500' as={FaHeart} />}
      ghost
      shouldRemovePadding={props.isCompact}
      smallHeader={props.isCompact}
    >
      <Stack>
        {pinnedPlayers &&
        !(props.tournament.tournamentStatus === 'running' && isLoading) ? (
          pinnedPlayers.map(
            pinnedPlayer =>
              pinnedPlayer && (
                <PinnedPlayerCard
                  key={`pinned-${pinnedPlayer?.name}`}
                  player={pinnedPlayer}
                  tournament={props.tournament}
                  shouldHideDecks={liveTournamentResults?.shouldHideDecks}
                  isDeckLoading={isLoading && !pinnedPlayer.deck?.id}
                  isEditingPinned={editPinnedPlayers.isOpen}
                  shouldHideOpponent={props.isCompact}
                />
              )
          )
        ) : (
          <ComponentLoader isLiveComponent />
        )}
        {!props.isCompact && (
          <HStack justifyContent={'space-around'}>
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
            {pinnedPlayers && pinnedPlayers.length > 0 && (
              <Button
                variant='ghost'
                leftIcon={<FaRegEdit />}
                onClick={editPinnedPlayers.onToggle}
                isDisabled={props.tournament.tournamentStatus === 'not-started'}
                size={'sm'}
                colorScheme={editPinnedPlayers.isOpen ? 'pink' : 'blackAlpha'}
              >
                {editPinnedPlayers.isOpen
                  ? 'Stop editing'
                  : 'Edit favorite players'}
              </Button>
            )}
          </HStack>
        )}
        <PinPlayerModal
          tournament={props.tournament}
          modalControls={addPinPlayerModalControls}
        />
      </Stack>
    </CommonCard>
  );
};
