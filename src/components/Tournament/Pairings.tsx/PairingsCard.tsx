import { Card, Grid, Heading, Text } from '@chakra-ui/react';
import { Pairing, PairingSubmission } from '../../../../types/pairings';
import { Standing, Tournament } from '../../../../types/tournament';
import { PairingsPlayerInfo } from './PairingsPlayerInfo';

export const PairingsCard = ({
  pairing,
  tournament,
  isUserAdmin,
  pairingSubmission,
}: {
  pairing: Pairing;
  tournament: Tournament;
  isUserAdmin: boolean;
  pairingSubmission?: PairingSubmission;
}) => {
  return (
    <Card padding={4}>
      <Grid gridTemplateColumns={'1fr 1fr 1fr'} alignItems='center'>
        <PairingsPlayerInfo
          player={
            {
              name: 'Jared Grimes',
              deck: {
                id: 1,
                defined_pokemon: ['Eternatus-eternamax', 'chandelure'],
              },
            } as Standing
          }
          tournament={tournament}
          isUserAdmin={isUserAdmin}
        />
        <Heading size='md' textAlign={'center'}>
          {pairing.table}
        </Heading>
        <PairingsPlayerInfo
          player={
            {
              name: 'Tord Reklev',
              deck: { id: 1, defined_pokemon: ['Lugia'] },
            } as Standing
          }
          tournament={tournament}
          isUserAdmin={isUserAdmin}
        />
      </Grid>
    </Card>
  );
};
