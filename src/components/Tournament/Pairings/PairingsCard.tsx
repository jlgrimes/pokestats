import { Card, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { Pairing, PairingSubmission } from '../../../../types/pairings';
import { Standing, Tournament } from '../../../../types/tournament';
import { usePlayerDecks } from '../../../hooks/playerDecks';
import { PairingsPlayerInfo } from './PairingsPlayerInfo';
import { SubmissionView } from './Submissions/SubmissionView';

export const PairingsCard = ({
  pairing,
  tournament,
  isUserAdmin,
  pairingSubmissions,
  round,
  refetchData,
  addToUpdateLog,
}: {
  pairing: Pairing;
  tournament: Tournament;
  isUserAdmin: boolean;
  round: number;
  pairingSubmissions?: PairingSubmission[] | null;
  refetchData: () => {};
  addToUpdateLog: (name: string) => void;
}) => {
  const { data: players } = usePlayerDecks(tournament.id, {
    pairingPlayers: pairing.players,
  });

  const currentRoundPairingMatches =
    pairingSubmissions?.filter(
      submission =>
        submission.round_number === round &&
        submission.table_number === pairing.table
    ) ?? [];

  const knownDecksCount = Math.min(
    players.filter(player => player.defined_pokemon).length +
      currentRoundPairingMatches?.length,
    2
  );

  return (
    <Card paddingY={4} paddingLeft={2}>
      <Stack>
        <Grid gridTemplateColumns={'3rem 2fr 2fr'} alignItems='center'>
          <Heading size='md'>
            {pairing.table}
          </Heading>
          {players[0] && (
            <PairingsPlayerInfo
              player={players[0]}
              tournament={tournament}
              isUserAdmin={isUserAdmin}
            />
          )}
          {players[1] && (
            <PairingsPlayerInfo
              player={players[1]}
              tournament={tournament}
              isUserAdmin={isUserAdmin}
            />
          )}
        </Grid>
        {isUserAdmin && (
          <SubmissionView
            playerNames={players.map(({ name }) => name)}
            roundNumber={round}
            tournament={tournament}
            pairingSubmissions={pairingSubmissions}
            knownDecksCount={knownDecksCount}
            tableNumber={pairing.table}
            refetchData={refetchData}
            addToUpdateLog={addToUpdateLog}
          />
        )}
      </Stack>
    </Card>
  );
};
