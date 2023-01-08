import { Grid, GridItem, Text } from '@chakra-ui/react';
import { Standing, Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { StandingsRow } from './StandingsRow';
import { StandingsRowExpandable } from './StandingsRowExpandable';
import { memo } from 'react';

export const StandingsList = memo(
  ({
    results,
    tournament,
  }: {
    results: Standing[];
    tournament: Tournament;
  }) => {
    const { data: userIsAdmin } = useUserIsAdmin();

    return (
      <Grid
        gridTemplateColumns='repeat(4, auto)'
        paddingLeft={2}
        rowGap={1}
        alignItems='center'
      >
        <GridItem></GridItem>
        <Text fontSize='sm'>Name</Text>
        <Text fontSize='sm'>Record</Text>
        <Text fontSize='sm'>Deck</Text>
        {results.map((result: Standing, idx: number) => (
          <StandingsRowExpandable
            key={idx}
            result={result}
            tournament={tournament}
            canEditDecks={userIsAdmin && !result.deck.list}
          />
        ))}
      </Grid>
    );
  }
);

StandingsList.displayName = 'StandingsList';
