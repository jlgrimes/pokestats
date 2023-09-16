import { useDisclosure } from '@chakra-ui/react';
import { UserAddIcon, UserRemoveIcon } from '@heroicons/react/outline';
import { Button, Card, Flex, List, Text, Title } from '@tremor/react';
import { Tournament } from '../../../../../types/tournament';
import { useFinalResults } from '../../../../hooks/finalResults';
import { usePinnedPlayers } from '../../../../hooks/pinnedPlayers';
import { useLiveTournamentResults } from '../../../../hooks/tournamentResults';
import { useColor } from '../../../../hooks/useColor';
import { useSessionPlayerProfile } from '../../../../hooks/user';
import { CommonCard } from '../../../common/CommonCard';
import { ComponentLoader } from '../../../common/ComponentLoader';
import { PinnedPlayerCard } from './PinnedPlayerCard';
import { PinPlayerModal } from './PinPlayerModal';

interface PinnedPlayerListProps {
  tournament: Tournament;
  isCompact?: boolean;
}

export const PinnedPlayerList = (props: PinnedPlayerListProps) => {
  const { header } = useColor();
  const { data: pinnedPlayerNames, isLoading: arePinnedPlayersLoading } =
    usePinnedPlayers();

  const { data: tournamentPerformance, isLoading: areFinalResultsLoading } =
    useFinalResults({
      tournamentId: props.tournament.id,
      playerNames: pinnedPlayerNames ?? []
    });

  const { data: liveTournamentResults, isLoading } = useLiveTournamentResults(
    props.tournament.id,
    { load: { allRoundData: true } }
  );
  const resultsAreLoading =
    (props.tournament.tournamentStatus === 'running' && isLoading) ||
    (props.tournament.tournamentStatus === 'finished' &&
      areFinalResultsLoading);

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

  const filteredPlayers = pinnedPlayers?.filter(player => player);

  if (
    props.isCompact &&
    pinnedPlayers?.filter(player => player)?.length === 0 &&
    !arePinnedPlayersLoading &&
    !resultsAreLoading
  )
    return null;

  if (props.isCompact && resultsAreLoading)
    return <ComponentLoader isLiveComponent />;

  return (
    <Card>
      <Title>Following</Title>
      <List className='mt-4'>
        {!props.isCompact && filteredPlayers && filteredPlayers.length > 0 && (
            <Flex>
              <Button
                icon={UserAddIcon}
                onClick={addPinPlayerModalControls.onOpen}
                disabled={props.tournament.tournamentStatus === 'not-started'}
              >
                Follow player
              </Button>
              {pinnedPlayers && pinnedPlayers.length > 0 && (
                <Button
                  icon={UserRemoveIcon}
                  onClick={editPinnedPlayers.onToggle}
                  disabled={props.tournament.tournamentStatus === 'not-started'}
                >
                  {editPinnedPlayers.isOpen ? 'Stop editing' : 'Edit following'}
                </Button>
              )}
            </Flex>
          )}
          {(!props.isCompact && resultsAreLoading) || !pinnedPlayers ? (
            <ComponentLoader isLiveComponent />
          ) : (
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
                    size={props.isCompact ? 'md' : 'lg'}
                  />
                )
            )
        )}
          {filteredPlayers?.length === 0 && (
            <Flex className='flex-col'>
              {pinnedPlayerNames && pinnedPlayerNames.length === 0 && (
                <Text>
                  Keep up with your friends or anyone attending by following a
                  player!
                </Text>
              )}
              {pinnedPlayerNames && pinnedPlayerNames.length > 0 && (
                <Text>
                  None of your following are attending this tournament.
                </Text>
              )}
              <Button
                icon={UserAddIcon}
                onClick={addPinPlayerModalControls.onOpen}
                disabled={props.tournament.tournamentStatus === 'not-started'}
              >
                Follow player
              </Button>
            </Flex>
          )}
          <PinPlayerModal
            tournament={props.tournament}
            modalControls={addPinPlayerModalControls}
          />
      </List>
    </Card>
  );
};
