import { Card, Grid, Heading, Stack, Text } from '@chakra-ui/react';
import { Pairing, PairingSubmission } from '../../../../types/pairings';
import { Standing, Tournament } from '../../../../types/tournament';
import { PairingsPlayerInfo } from './PairingsPlayerInfo';
import { SubmissionView } from './Submissions/SubmissionView';

export const PairingsCard = ({
  pairing,
  tournament,
  isUserAdmin,
  pairingSubmissions,
  round,
  refetchData,
}: {
  pairing: Pairing;
  tournament: Tournament;
  isUserAdmin: boolean;
  round: number;
  pairingSubmissions: PairingSubmission[];
  refetchData: () => {};
}) => {
  const players = [
    {
      name: 'Jared Grimes',
    } as Standing,
    {
      name: 'Tord Reklev',
    } as Standing,
  ];
  const knownDecksCount = players.filter(
    player => player.deck?.defined_pokemon
  ).length;

  return (
    <Card padding={4}>
      <Stack>
        <Grid gridTemplateColumns={'1fr 1fr 1fr'} alignItems='center'>
          <PairingsPlayerInfo
            player={players[0]}
            tournament={tournament}
            isUserAdmin={isUserAdmin}
          />
          <Heading size='md' textAlign={'center'}>
            {pairing.table}
          </Heading>
          <PairingsPlayerInfo
            player={players[1]}
            tournament={tournament}
            isUserAdmin={isUserAdmin}
          />
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
          />
        )}
      </Stack>
    </Card>
  );
};
