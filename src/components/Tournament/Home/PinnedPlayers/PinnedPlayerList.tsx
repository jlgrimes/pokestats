import { useDisclosure } from '@chakra-ui/react';
import { UserAddIcon, UserRemoveIcon } from '@heroicons/react/outline';
import { Button, Card, Flex, List, Table, TableBody, Text, Title } from '@tremor/react';
import { Tournament } from '../../../../../types/tournament';
import { usePinnedPlayers } from '../../../../hooks/pinnedPlayers';
import { ComponentLoader } from '../../../common/ComponentLoader';
import { PinnedPlayerCard } from './PinnedPlayerCard';
import { PinPlayerModal } from './PinPlayerModal';
import { useFollowingStandings, useStandings } from '../../../../hooks/newStandings';
import { FullWidthCard } from '../../../common/new/FullWidthCard';
import { trackEvent } from '../../../../lib/track';

interface PinnedPlayerListProps {
  tournament: Tournament;
  isCompact?: boolean;
}

export const PinnedPlayerList = (props: PinnedPlayerListProps) => {
  // TODO: IMPLEMENT
  const ageDivision = 'masters';

  const { data: pinnedPlayerNames, isLoading: arePinnedPlayersLoading } =
    usePinnedPlayers();

  const { data: pinnedPlayers, isLoading: areFinalResultsLoading } = useFollowingStandings(pinnedPlayerNames, props.tournament);

  const resultsAreLoading =
    (props.tournament.tournamentStatus === 'finished' &&
      areFinalResultsLoading);

  const addPinPlayerModalControls = useDisclosure();
  const editPinnedPlayers = useDisclosure();

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
    <FullWidthCard title='Following'>
        {!props.isCompact && pinnedPlayers && pinnedPlayers.length > 0 && (
          <Flex className='flex gap-8 px-5 pb-4'>
            <Button
              icon={UserAddIcon}
              onClick={() => {
                trackEvent('Follow player button clicked')
                addPinPlayerModalControls.onOpen();
              }}
              disabled={props.tournament.tournamentStatus === 'not-started'}
              variant='light'
            >
              Follow player
            </Button>
            {pinnedPlayers && pinnedPlayers.length > 0 && (
              <Button
                icon={UserRemoveIcon}
                onClick={() => {
                  trackEvent('Edit following button clicked', { desiredState: !editPinnedPlayers.isOpen })
                  editPinnedPlayers.onToggle();
                }}
                disabled={props.tournament.tournamentStatus === 'not-started'}
                variant='light'
              >
                {editPinnedPlayers.isOpen ? 'Stop editing' : 'Edit following'}
              </Button>
            )}
          </Flex>
        )}
        {(!props.isCompact && resultsAreLoading) || !pinnedPlayers ? (
          <ComponentLoader isLiveComponent />
        ) : (
          <Table className='overflow-hidden'>
            <TableBody>
              {pinnedPlayers.map(
                pinnedPlayer =>
                  pinnedPlayer && (
                    <PinnedPlayerCard
                      key={`pinned-${pinnedPlayer?.name}`}
                      player={pinnedPlayer}
                      tournament={props.tournament}
                      isDeckLoading={arePinnedPlayersLoading && !pinnedPlayer.deck_archetype}
                      isEditingPinned={editPinnedPlayers.isOpen}
                      shouldHideOpponent={props.isCompact}
                      size={props.isCompact ? 'md' : 'lg'}
                    />
                  )
              )}
            </TableBody>
          </Table>
      )}
        {pinnedPlayers?.length === 0 && (
          <Flex className='flex-col'>
            {pinnedPlayers && pinnedPlayers.length === 0 && (
              <Text>
                Keep up with your friends or anyone attending by following a
                player!
              </Text>
            )}
            {pinnedPlayers && pinnedPlayers.length > 0 && (
              <Text>
                None of your following are attending this tournament.
              </Text>
            )}
            <Button
              icon={UserAddIcon}
              onClick={() => {
                trackEvent('Follow player button clicked when zero following')
                addPinPlayerModalControls.onOpen();
              }}
              disabled={props.tournament.tournamentStatus === 'not-started'}
            >
              Follow player
            </Button>
          </Flex>
        )}
        <PinPlayerModal
          tournament={props.tournament}
          modalControls={addPinPlayerModalControls}
          ageDivision={ageDivision}
        />
    </FullWidthCard>
  );
};
