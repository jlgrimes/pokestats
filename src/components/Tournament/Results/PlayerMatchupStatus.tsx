import { Heading, Skeleton, Stack, Text, useColorMode } from '@chakra-ui/react';
import { usePlayerLiveResults } from '../../../hooks/tournamentResults';
import { DeckInfoDisplay } from '../../Deck/DeckInfoDisplay';
import { formatRecordNeed, formatRecord } from './ResultsList/helpers';
import { ordinalSuffixOf } from '../../../lib/strings';
import { Tournament } from '../../../../types/tournament';
import { Record } from './ResultsList/Record';
import { StoredPlayerProfile } from '../../../../types/player';
import { useSession } from 'next-auth/react';
import { RecordIcon } from './ResultsList/RecordIcon';
import { getPercentile } from './helpers';
import { useCallback } from 'react';

export const PlayerMatchupStatus = ({
  tournament,
  user,
  shouldHideOpponentView,
  isLoggedInUser,
}: {
  tournament: Tournament;
  user: StoredPlayerProfile | null;
  shouldHideOpponentView?: boolean;
  isLoggedInUser?: boolean;
}) => {
  const tournamentFinished = tournament.tournamentStatus === 'finished';
  const session = useSession();
  const { colorMode } = useColorMode();
  const {
    player: playerResults,
    shouldHideDecks,
    isLoading,
  } = usePlayerLiveResults(tournament.id, user?.name);

  const renderLoadingSkeleton = useCallback(
    () => <Skeleton height={63.9} />,
    []
  );

  if (!user) return renderLoadingSkeleton();

  return !isLoading && playerResults && user ? (
    <Stack alignItems={'center'} spacing={4} py={1}>
      <Stack direction={'row'} alignItems='center'>
        <DeckInfoDisplay
          tournament={tournament}
          player={playerResults}
          enableEdits={!!isLoggedInUser}
          shouldHideDeck={shouldHideDecks}
          shouldHideOpponentView={shouldHideOpponentView}
          shouldDisableDeckExtras={!isLoggedInUser}
        />
        <Stack direction={'row'} alignItems='baseline'>
          <Stack direction='row' alignItems={'baseline'} spacing={1}>
            <Record standing={playerResults} big />
            <RecordIcon standing={playerResults} tournament={tournament} />
            <Heading
              size='sm'
              color={colorMode === 'dark' ? 'gray.500' : 'gray.700'}
            >
              {`${ordinalSuffixOf(playerResults.placing)}`}
            </Heading>
          </Stack>
          {tournamentFinished && (
            <Heading
              size='sm'
              color={colorMode === 'dark' ? 'gray.500' : 'gray.700'}
            >
              {`Top ${getPercentile(
                playerResults.placing,
                tournament.players.masters as number
              )}%`}
            </Heading>
          )}
        </Stack>
      </Stack>
      {/* {!tournamentFinished && (
        <RecordNeeded
          record={playerResults.record}
          objective='day 2'
          matchPointsNeeded={19}
          roundsLeft={9 - (playerResults.rounds?.length ?? 0)}
        />
      )} */}
    </Stack>
  ) : (
    renderLoadingSkeleton()
  );
};
