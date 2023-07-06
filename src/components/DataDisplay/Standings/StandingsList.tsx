import { Box, Divider, Grid, GridItem, Stack, Text } from '@chakra-ui/react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import { Standing, Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { StandingsRowExpandable } from './StandingsRowExpandable';
import { Fragment, memo, useMemo, useCallback, useEffect } from 'react';
import { tableHeadingProps } from './props';
import { VirtualizedRow } from './VirtualizedRow';
import { PlayerCard } from '../../Tournament/Home/PlayerCard/PlayerCard';
import { Ad } from '../../Ad';
import { useFixAutoHeight } from '../../../hooks/useFixAutoHeight';

export const StandingsList = memo(
  ({
    results,
    tournament,
    shouldHideDecks,
  }: {
    results: Standing[];
    tournament: Tournament;
    shouldHideDecks: boolean;
  }) => {
    useFixAutoHeight(['tournament-view', 'standings']);
    const { data: userIsAdmin } = useUserIsAdmin();

    const VirtualizedRowCallback = useCallback(
      ({ index, style }: { index: number; style: any }) => (
        index === 0 ?             <Ad slot='3745883635' height={'44px'} /> :
        <VirtualizedRow
          index={index - 1}
          style={style}
          standing={results[index - 1]}
          tournament={tournament}
          canEditDecks={userIsAdmin}
          shouldHideDeck={shouldHideDecks}
        />
      ),
      [results, shouldHideDecks, tournament, userIsAdmin]
    );

    const WindowCallback = useCallback(
      ({ height, width }: { height: number; width: number }) => {
        return (
          <List
            height={height}
            width={width}
            itemSize={44}
            itemCount={results.length}
          >
            {VirtualizedRowCallback}
          </List>
        );
      },
      [VirtualizedRowCallback, results.length]
    );

    return (
      <Stack id='standings' height='100%'>
        {/* {results.map(standing => (
          <PlayerCard
            key={`standing-${standing.name}`}
            player={standing}
            tournament={tournament}
            shouldHideDecks={shouldHideDecks}
            canEditDecks={userIsAdmin}
            size='sm'
            shouldHideOpponent
            isPlayerMeOrMyOpponent={false}
          />
        ))} */}
        {/* <Grid
          gridTemplateColumns='2.65rem 2fr 1fr 1fr'
          gridTemplateRows='20px auto'
          paddingRight={1}
        >
          <GridItem></GridItem>
          <Text {...tableHeadingProps}>Name</Text>
          <Text {...tableHeadingProps} paddingLeft={2}>
            Deck
          </Text>
          <Text {...tableHeadingProps} paddingRight={1} textAlign='right'>
            Record
          </Text>
        </Grid> */}
        <AutoSizer>{WindowCallback}</AutoSizer>
      </Stack>
    );
  }
);

StandingsList.displayName = 'StandingsList';
