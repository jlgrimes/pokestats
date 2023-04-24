import { Heading, Skeleton, Stack, Text, useColorMode } from '@chakra-ui/react';
import {
  PlayerLiveResultsSchema,
  usePlayerLiveResults,
} from '../../../hooks/tournamentResults';
import { DeckInfoDisplay } from '../../Deck/DeckInfoDisplay';
import { formatRecordNeed, formatRecord } from './ResultsList/helpers';
import { ordinalSuffixOf } from '../../../lib/strings';
import { Standing, Tournament } from '../../../../types/tournament';
import { Record } from './ResultsList/Record';
import { CombinedPlayerProfile } from '../../../../types/player';
import { RecordIcon } from './ResultsList/RecordIcon';
import { getPercentile } from './helpers';
import { useCallback } from 'react';
import { useColor } from '../../../hooks/useColor';

export const PlayerMatchupStatus = ({
  tournament,
  user,
  shouldHideOpponentView,
  isLoggedInUser,
  livePlayerResults,
}: {
  tournament: Tournament;
  user: CombinedPlayerProfile | null;
  shouldHideOpponentView?: boolean;
  isLoggedInUser?: boolean;
  livePlayerResults: PlayerLiveResultsSchema;
}) => {
  const tournamentFinished = tournament.tournamentStatus === 'finished';
  const { header } = useColor();
  const {
    player: playerResults,
    shouldHideDecks,
    isLoading,
  } = livePlayerResults;

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
          isPlayerMeOrMyOpponent={!!isLoggedInUser}
        />
        <Stack direction={'row'} alignItems='baseline'>
          <Stack direction='row' alignItems={'baseline'} spacing={1}>
            <Record standing={playerResults} big />
            <RecordIcon standing={playerResults} tournament={tournament} />
            <Heading
              size='sm'
              color={header}
            >
              {`${ordinalSuffixOf(playerResults.placing)}`}
            </Heading>
          </Stack>
          {tournamentFinished && (
            <Heading
              size='sm'
              color={header}
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
