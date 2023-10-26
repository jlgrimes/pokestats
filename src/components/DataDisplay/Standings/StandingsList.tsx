import { Box, Divider, Grid, GridItem, Stack, Text } from '@chakra-ui/react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeListProps, FixedSizeList } from 'react-window';
import { Standing, Tournament } from '../../../../types/tournament';
import { useUserIsAdmin } from '../../../hooks/administrators';
import { Fragment, memo, useMemo, useCallback, useEffect, forwardRef, useContext, createContext, useRef, useState } from 'react';
import { tableHeadingProps } from './props';
import { VirtualizedRow } from './VirtualizedRow';
import { PlayerCard } from '../../Tournament/Home/PlayerCard/PlayerCard';
import { Ad } from '../../Ad';
import { useFixAutoHeight } from '../../../hooks/useFixAutoHeight';
import { Table, TableBody } from '@tremor/react';

/** Context for cross component communication */
const VirtualTableContext = createContext<{
  top: number
  setTop: (top: number) => void
  header: React.ReactNode
  footer: React.ReactNode
}>({
  top: 0,
  setTop: (value: number) => {},
  header: <></>,
  footer: <></>,
})

/** The virtual table. It basically accepts all of the same params as the original FixedSizeList.*/
function VirtualTable({
  row,
  header,
  footer,
  ...rest
}: {
  header?: React.ReactNode
  footer?: React.ReactNode
  row: FixedSizeListProps['children']
} & Omit<FixedSizeListProps, 'children' | 'innerElementType'>) {
  const listRef = useRef<FixedSizeList | null>()
  const [top, setTop] = useState(0)

  return (
    <VirtualTableContext.Provider value={{ top, setTop, header, footer }}>
      <FixedSizeList
        {...rest}
        innerElementType={Inner}
        onItemsRendered={props => {
          const style =
            listRef.current &&
            // @ts-ignore private method access
            listRef.current._getItemStyle(props.overscanStartIndex)
          setTop((style && style.top) || 0)

          // Call the original callback
          rest.onItemsRendered && rest.onItemsRendered(props)
        }}
        ref={el => (listRef.current = el)}
      >
        {row}
      </FixedSizeList>
    </VirtualTableContext.Provider>
  )
}

/**
 * The Inner component of the virtual list. This is the "Magic".
 * Capture what would have been the top elements position and apply it to the table.
 * Other than that, render an optional header and footer.
 **/
const Inner = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  function Inner({ children, ...rest }, ref) {
    const { header, footer, top } = useContext(VirtualTableContext)
    return (
      <div {...rest} ref={ref}>
        <Table style={{ top, position: 'absolute', width: '100%' }}>
          {header}
          <TableBody>{children}</TableBody>
          {footer}
        </Table>
      </div>
    )
  }
)

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

    /** The Row component. This should be a table row, and noted that we don't use the style that regular `react-window` examples pass in.*/
    function Row({ index }: { index: number }) {
      return (
        <VirtualizedRow index={index} standing={results[index]} tournament={tournament} shouldHideDeck={shouldHideDecks} canEditDecks={userIsAdmin} />
      )
    }

    const WindowCallback = useCallback(
      ({ height, width }: { height: number; width: number }) => {
        return (
          <VirtualTable
            height={height}
            width={width}
            itemCount={results.length}
            itemSize={44}
            row={Row}
          />
        );
      },
      [ results.length]
    );

    return (
      <AutoSizer>{WindowCallback}</AutoSizer>
    );
  }
);

StandingsList.displayName = 'StandingsList';
