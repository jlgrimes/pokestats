import { Divider, Grid, GridItem, Stack, Text } from '@chakra-ui/react';
import { Standing, Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { StandingsRow } from './StandingsRow';
import { StandingsRowExpandable } from './StandingsRowExpandable';
import { Fragment, memo } from 'react';

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
        alignItems='center'
      >
        <GridItem></GridItem>
        <Text
          fontSize='xs'
          color={'gray.700'}
          fontFamily='heading'
          fontWeight='bold'
          textTransform={'uppercase'}
          letterSpacing='wider'
        >
          Name
        </Text>
        <Text
          fontSize='xs'
          color={'gray.700'}
          fontFamily='heading'
          fontWeight='bold'
          textTransform={'uppercase'}
          letterSpacing='wider'
          paddingLeft={1}
        >
          Record
        </Text>
        <Text
          fontSize='xs'
          color={'gray.700'}
          fontFamily='heading'
          fontWeight='bold'
          textTransform={'uppercase'}
          letterSpacing='wider'
          paddingLeft={2}
        >
          Deck
        </Text>
        {results.map((result: Standing, idx: number) => (
          <Fragment key={idx}>
            <Divider gridColumn='1/-1' />
            <StandingsRowExpandable
              key={idx}
              result={result}
              tournament={tournament}
              canEditDecks={userIsAdmin && !result.deck.list}
            />
          </Fragment>
        ))}
      </Grid>
    );
  }
);

StandingsList.displayName = 'StandingsList';
