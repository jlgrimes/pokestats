import { createContext, memo, useContext, useMemo, useState } from 'react';
import { Grid, Spinner } from '@chakra-ui/react';
import { useStoredDecks } from '../../../../hooks/finalResults';
import { IndividualShareCard } from './IndividualShareCard';
import { getMetaDiff } from './helpers';
import { NoDataDisplay } from './NoDataDisplay';
import { CommonCard } from '../../../common/CommonCard';

export const ShouldDrillDownMetaShareContext = createContext(false);

export const MetaGameShareList = memo(
  ({
    tournamentRange,
    sortByMoves,
    preview,
    shouldHideSlug,
    tournamentName,
  }: {
    tournamentRange: number[];
    sortByMoves?: boolean;
    preview?: boolean;
    shouldHideSlug?: boolean;
    tournamentName?: string;
  }) => {
    const [shouldDrillDown, setShouldDrillDown] = useState(false);

    let { data: decks, isLoading } = useStoredDecks({
      tournamentRange,
      shouldDrillDown,
    });

    const numberOfPlayers = useMemo(
      () => decks.reduce((acc, deck) => acc + deck.count, 0),
      [decks]
    );

    if (isLoading) return <Spinner />;
    if (decks.length === 0) return <NoDataDisplay />;

    return (
      <ShouldDrillDownMetaShareContext.Provider value={shouldDrillDown}>
        <CommonCard
          header={
            tournamentName ? `${tournamentName} Day Two Decks` : `Day Two Decks`
          }
          subheader={`${numberOfPlayers} Masters`}
          {...(shouldHideSlug
            ? {}
            : {
                slug: `/decks?tournament=${`${tournamentRange[0]}`.padStart(
                  7,
                  '0'
                )}`,
              })}
          ghost
        >
          <Grid gridTemplateColumns={'1fr 1fr'}>
            {decks.slice(0, preview ? 4 : undefined).map(({ deck, count }) => {
              return (
                deck?.id && (
                  <IndividualShareCard
                    key={`${deck.name}${deck.id}`}
                    deck={deck}
                    count={count}
                    tournamentRange={tournamentRange}
                  />
                )
              );
            })}
          </Grid>
        </CommonCard>
      </ShouldDrillDownMetaShareContext.Provider>
    );
  }
);

MetaGameShareList.displayName = 'MetaGameDisplayList';
