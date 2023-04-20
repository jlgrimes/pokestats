import { Container, Stack, StackItem } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { createContext, Fragment, useEffect, useState } from 'react';
import { Deck } from '../../../../types/tournament';
import {
  FormatSchema,
  useFormats,
  useMostRecentFormat,
} from '../../../hooks/formats/formats';
import { BackToDecksButton } from './BackToDecksButton';
import { DeckHeader } from './DeckHeader';

export const FormatContext =
  createContext<FormatSchema | null | undefined>(undefined);

export const DeckAnalyticsContainer = ({
  children,
  deck,
  compactTitle,
}: {
  children: JSX.Element;
  deck: Deck;
  compactTitle?: boolean;
}) => {
  const { data: formats } = useFormats();
  const mostRecentFormat = useMostRecentFormat();
  const [viewedFormat, setViewedFormat] = useState<FormatSchema | null>();
  const router = useRouter();

  useEffect(() => {
    const foundFormat = formats?.find(
      ({ id }) => id === parseInt(router.query.format as string)
    );
    if (foundFormat) {
      setViewedFormat(foundFormat);
    } else {
      setViewedFormat(mostRecentFormat);
    }
  }, [formats, router.query.format, mostRecentFormat]);

  return (
    <FormatContext.Provider value={viewedFormat}>
      <Container>
        <Stack spacing={4}>
          <DeckHeader deck={deck} compact={compactTitle} />
          <Fragment>{children}</Fragment>
        </Stack>
      </Container>
    </FormatContext.Provider>
  );
};
