import { Stack, StackItem } from '@chakra-ui/react';
import { createContext, useEffect, useState } from 'react';
import { Deck } from '../../../../types/tournament';
import {
  useCurrentFormat,
  useMostRecentFormat,
} from '../../../hooks/formats/formats';
import { BackToDecksButton } from './BackToDecksButton';
import { DeckHeader } from './DeckHeader';

export const FormatContext = createContext<number | undefined>(undefined);

export const DeckAnalyticsContainer = ({
  children,
  deck,
  compactTitle,
}: {
  children: JSX.Element;
  deck: Deck;
  compactTitle?: boolean;
}) => {
  const mostRecentFormat = useMostRecentFormat();
  const [viewedFormat, setViewedFormat] = useState();

  useEffect(() => {
    setViewedFormat(mostRecentFormat?.id);
  }, [mostRecentFormat]);

  return (
    <FormatContext.Provider value={viewedFormat}>
      <Stack spacing={4}>
        <DeckHeader deck={deck} compact={compactTitle} />
        <Stack>{children}</Stack>
      </Stack>
    </FormatContext.Provider>
  );
};
