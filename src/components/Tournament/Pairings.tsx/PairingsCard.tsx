import { Card, Grid, Heading, Text } from '@chakra-ui/react';
import { Pairing } from '../../../../types/pairings';

export const PairingsCard = ({ pairing }: { pairing: Pairing }) => {
  return (
    <Card padding={4}>
      <Grid gridTemplateColumns={'1fr 1fr 1fr'} alignItems='center'>
        <Text textAlign={'center'}>{pairing.players[0]}</Text>
        <Heading textAlign={'center'}>{pairing.table}</Heading>
        <Text textAlign={'center'}>{pairing.players[1]}</Text>
      </Grid>
    </Card>
  );
};
