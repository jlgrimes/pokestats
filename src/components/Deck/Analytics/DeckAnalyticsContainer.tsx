import { Stack } from '@chakra-ui/react';
import { Deck } from '../../../../types/tournament';
import { BackToDecksButton } from './BackToDecksButton';
import { DeckHeader } from './DeckHeader';

export const DeckAnalyticsContainer = ({
  children,
  deck,
  compactTitle,
}: {
  children: JSX.Element;
  deck: Deck;
  compactTitle?: boolean;
}) => (
  <Stack>
    <BackToDecksButton />
    <DeckHeader deck={deck} compact={compactTitle} />
    {children}
  </Stack>
);
