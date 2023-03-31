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
}: {
  tournament: Tournament;
  user: StoredPlayerProfile | null;
  shouldHideOpponentView?: boolean;
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

  const isCurrentUser = session.data?.user?.email === user.email;

  return !isLoading && playerResults && user ? (
    <Stack alignItems={'center'} spacing={4}>
      <Stack spacing={0} alignItems='center'>
        <Stack direction={'row'} alignItems='baseline'>
          <Stack direction='row' alignItems={'baseline'} spacing={1}>
            <Record standing={playerResults} big />
            <RecordIcon standing={playerResults} tournament={tournament} />
            <Heading
              size='sm'
              color={colorMode === 'dark' ? 'gray.100' : 'gray.700'}
            >
              {`${ordinalSuffixOf(playerResults.placing)}`}
            </Heading>
          </Stack>
          <DeckInfoDisplay
            tournament={tournament}
            player={playerResults}
            enableEdits={isCurrentUser}
            shouldHideDeck={shouldHideDecks}
            shouldHideOpponentView={shouldHideOpponentView}
          />
          {tournamentFinished && (
            <Heading
              size='sm'
              color={colorMode === 'dark' ? 'gray.100' : 'gray.700'}
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
