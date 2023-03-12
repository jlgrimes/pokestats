import { Box, Divider, Grid, GridItem, Stack, Text } from '@chakra-ui/react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import { Standing, Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { StandingsRowExpandable } from './StandingsRowExpandable';
import { Fragment, memo, useMemo, useCallback } from 'react';
import { tableHeadingProps } from './props';
import { VirtualizedRow } from './VirtualizedRow';

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
    const { data: userIsAdmin } = useUserIsAdmin();

    const VirtualizedRowCallback = useCallback(
      ({ index, style }: { index: number; style: any }) => (
        <VirtualizedRow
          index={index}
          style={style}
          standing={results[index]}
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
      <Stack height='100%'>
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
