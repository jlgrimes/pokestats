import { Heading, Stack, Text } from '@chakra-ui/react';
import { usePlayerLiveResults } from '../../../hooks/tournamentResults';
import { DeckInfoDisplay } from '../../Deck/DeckInfoDisplay';
import { formatRecordNeed, formatRecord } from './ResultsList/helpers';
import { ordinalSuffixOf } from '../../../lib/strings';
import { Tournament } from '../../../../types/tournament';
import { Record } from './ResultsList/Record';
import { StoredPlayerProfile } from '../../../../types/player';
import { useSession } from 'next-auth/react';

const RecordNeeded = ({
  record,
  objective,
  matchPointsNeeded,
  roundsLeft,
}: {
  record: {
    wins: number;
    losses: number;
    ties: number;
  };
  objective: 'day 2' | 'top 8';
  matchPointsNeeded: number;
  roundsLeft: number;
}) => {
  const matchPointsRemaining =
    matchPointsNeeded - record.wins * 3 - record.ties;

  if (matchPointsRemaining <= 0) {
    return (
      <Heading
        size='sm'
        color='gray.700'
      >{`Congrats, you've made it to ${objective}! 🥳`}</Heading>
    );
  }

  if (matchPointsRemaining / 3 > roundsLeft) {
    return (
      <Text fontSize='sm'>{`You're out of contention for ${objective} 😓`}</Text>
    );
  }

  return (
    <Stack direction={'row'} alignItems='baseline'>
      <Text fontSize='sm'>You need</Text>
      <Heading color='gray.700' size='md'>
        {formatRecordNeed(matchPointsNeeded, record)}
      </Heading>
      <Text fontSize='sm'>{`to ${objective}`}</Text>
    </Stack>
  );
};

export const PlayerMatchupStatus = ({
  tournament,
  user,
  tournamentFinished,
}: {
  tournament: Tournament;
  user: StoredPlayerProfile;
  tournamentFinished: boolean;
}) => {
  const session = useSession();
  const getPlayerText =
    session.data?.user.email === user.email ? 'You' : user.name;

  const playerResults = usePlayerLiveResults(tournament.id, user.name);
  return playerResults ? (
    <Stack alignItems={'center'} spacing={4}>
      <Stack spacing={0} alignItems='center'>
        <Stack direction={'row'} alignItems='baseline'>
          <Text>
            {tournamentFinished ? `${getPlayerText} finished` : `You are`}
          </Text>
          <Stack direction='row' alignItems={'baseline'} spacing={1}>
            <Record
              standing={playerResults}
              tournamentFinished={tournamentFinished}
              big
            />
            <Heading size='sm' color='gray.500'>
              {ordinalSuffixOf(playerResults.placing)}
            </Heading>
          </Stack>
        </Stack>
        <Stack direction={'row'} alignItems='baseline' spacing={1}>
          <Text>with</Text>
          <DeckInfoDisplay
            tournament={tournament}
            player={playerResults}
            enableEdits={true}
            shouldShowAsText
          />
        </Stack>
      </Stack>
      {!tournamentFinished && (
        <RecordNeeded
          record={playerResults.record}
          objective='day 2'
          matchPointsNeeded={19}
          roundsLeft={9 - (playerResults.rounds?.length ?? 0)}
        />
      )}
    </Stack>
  ) : (
    <></>
  );
};
