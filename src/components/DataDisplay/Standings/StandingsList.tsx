import { Box, Divider, Grid, GridItem, Stack, Text } from '@chakra-ui/react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import { Standing, Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { StandingsRowExpandable } from './StandingsRowExpandable';
import { Fragment, memo } from 'react';
import { tableHeadingProps } from './props';

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

    const VirtualizedRow = ({
      index,
      style,
    }: {
      index: number;
      style: any;
    }) => (
      <Box style={style}>
        <StandingsRowExpandable
          result={results[index]}
          tournament={tournament}
          canEditDecks={userIsAdmin}
          shouldHideDeck={shouldHideDecks}
        />
        <Divider />
      </Box>
    );

    return (
      <Stack flexGrow={1}>
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
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              width={width}
              itemSize={42}
              itemCount={results.length}
            >
              {VirtualizedRow}
            </List>
          )}
        </AutoSizer>
      </Stack>
    );
  }
);

StandingsList.displayName = 'StandingsList';
