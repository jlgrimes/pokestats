import { Heading, Stack, Text } from '@chakra-ui/react';
import { useLoggedInPlayerLiveResults } from '../../../hooks/tournamentResults';
import { DeckInfoDisplay } from '../../Deck/DeckInfoDisplay';
import { formatRecord } from './ResultsList/helpers';
import { ordinalSuffixOf } from '../../../lib/strings';

export const LoggedInPlayerStatus = ({
  tournament,
  tournamentFinished,
}: {
  tournament: { id: string; name: string };
  tournamentFinished: boolean;
}) => {
  const playerResults = useLoggedInPlayerLiveResults(tournament.id);
  return playerResults ? (
    <Stack alignItems={'center'} spacing={2}>
      <Stack direction={'row'} alignItems='center'>
        <Text>You are</Text>
        <Stack direction='row' alignItems={'center'} spacing={1}>
          <Heading color={'gray.700'}>
            {formatRecord(playerResults.record)}
          </Heading>
          <Heading size='xs' color='gray.500'>
            {ordinalSuffixOf(parseInt(playerResults.placing))}
          </Heading>
        </Stack>
        <Text>with</Text>
        <DeckInfoDisplay
          tournament={tournament}
          player={playerResults}
          enableEdits={true}
          quickEdits={false}
        />
      </Stack>
    </Stack>
  ) : (
    <></>
  );
};
