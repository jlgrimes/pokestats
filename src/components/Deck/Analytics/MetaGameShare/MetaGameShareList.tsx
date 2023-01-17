import { memo } from 'react';
import { Grid } from '@chakra-ui/react';
import { useStoredDecks } from '../../../../hooks/finalResults';
import { IndividualShareCard } from './IndividualShareCard';

export const MetaGameShareList = memo(
  ({ tournamentRange }: { tournamentRange: number[] }) => {
    const decks = useStoredDecks({ tournamentRange });

    return (
      <Grid gridTemplateColumns={'1fr 1fr'}>
        {decks.map(({ deck, count }) => {
          return (
            deck?.id && (
              <IndividualShareCard
                deck={deck}
                count={count}
                tournamentRange={tournamentRange}
              />
            )
          );
        })}
      </Grid>
    );
  }
);

MetaGameShareList.displayName = 'MetaGameDisplayList';
