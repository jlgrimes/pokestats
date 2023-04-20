import { Heading, Stack, useColorMode } from '@chakra-ui/react';
import { memo, useContext } from 'react';
import { Deck } from '../../../../../types/tournament';
import { DeckTypeSchema } from '../../../../hooks/deckArchetypes';
import { useStoredDecks } from '../../../../hooks/finalResults';
import { FinalResultsDeckSchema } from '../../../../hooks/finalResults/final-results-schema';
import { Stat } from '../../../common/Stat';
import { fixPercentage } from '../../ListViewer/CardViewer.tsx/helpers';
import { getMetaDiff, getMetaShare } from './helpers';
import { ShouldDrillDownMetaShareContext } from './MetaGameShareList';

const ifResultMatchesSchema = (
  deck: DeckTypeSchema,
  finalResult: FinalResultsDeckSchema
) =>
  deck.type === 'archetype'
    ? finalResult.deck_archetype?.id === deck.id
    : finalResult.deck_supertype?.id === deck.id;

export const getDay2Decks = (
  deck: DeckTypeSchema,
  decks: FinalResultsDeckSchema[]
) => {
  return decks.filter(
    finalDeck =>
      finalDeck.deck_archetype &&
      ifResultMatchesSchema(deck, finalDeck) &&
      finalDeck.day2
  ).length;
};

export const getConversionRate = (
  deck: DeckTypeSchema,
  decks: FinalResultsDeckSchema[]
) => {
  const reportedDecks = decks.filter(deck => deck.deck_archetype);
  const day2Decks = getDay2Decks(deck, decks);

  const totalDecks = reportedDecks.filter(finalDeck =>
    ifResultMatchesSchema(deck, finalDeck)
  );

  return day2Decks / totalDecks.length;
};

export const ConversionStat = memo(
  ({
    deck,
    tournamentId,
    isInactive,
  }: {
    deck: DeckTypeSchema;
    tournamentId: string;
    isInactive?: boolean;
  }) => {
    const shouldDrillDown = useContext(ShouldDrillDownMetaShareContext);
    const { decks } = useStoredDecks({
      tournamentId,
      shouldDrillDown,
    });

    if (deck.count && deck.count <= 20) return null;

    const conversionRate = getConversionRate(deck, decks);

    return (
      <Stat
        stat={conversionRate}
        label={`${getDay2Decks(deck, decks)} day two`}
        isInactive={isInactive}
      />
    );
  }
);

ConversionStat.displayName = 'ConversionStat';
