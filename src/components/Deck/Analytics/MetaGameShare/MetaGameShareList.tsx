import { memo, useMemo, useState } from 'react';
import { Grid, Spinner } from '@chakra-ui/react';
import { useStoredDecks } from '../../../../hooks/finalResults';
import { IndividualShareCard } from './IndividualShareCard';
import { getMetaDiff } from './helpers';
import { NoDataDisplay } from './NoDataDisplay';
import { CommonCard } from '../../../common/CommonCard';

export const MetaGameShareList = memo(
  ({
    tournamentRange,
    sortByMoves,
    preview,
    shouldHideSlug,
  }: {
    tournamentRange: number[];
    sortByMoves?: boolean;
    preview?: boolean;
    shouldHideSlug?: boolean;
  }) => {
    const [shouldDrillDown, setShouldDrillDown] = useState(false);

    let { data: decks, isLoading } = useStoredDecks({
      tournamentRange,
      shouldDrillDown,
    });
    const { data: previousDecks } = useStoredDecks({
      tournamentRange: [tournamentRange[0] - 1, tournamentRange[1] - 1],
    });

    if (sortByMoves) {
      decks = decks.sort((a, b) => {
        const firstMetaDiff = Math.abs(
          getMetaDiff(
            { ...a.deck, count: a.count },
            decks,
            previousDecks
          ) as number
        );
        const secondMetaDiff = Math.abs(
          getMetaDiff(
            { ...b.deck, count: b.count },
            decks,
            previousDecks
          ) as number
        );

        if (firstMetaDiff > secondMetaDiff) return -1;
        if (firstMetaDiff < secondMetaDiff) return 1;
        return 0;
      });
    }

    const numberOfPlayers = useMemo(
      () => decks.reduce((acc, deck) => acc + deck.count, 0),
      [decks]
    );

    if (isLoading) return <Spinner />;
    if (decks.length === 0) return <NoDataDisplay />;

    return (
      <CommonCard
        header={`Day Two Metagame`}
        subheader={`${numberOfPlayers} Masters in Day Two`}
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
    );
  }
);

MetaGameShareList.displayName = 'MetaGameDisplayList';
