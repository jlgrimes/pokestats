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

export const getConversionRate = (
  deck: DeckTypeSchema,
  decks: FinalResultsDeckSchema[]
) => {
  const reportedDecks = decks.filter(deck => deck.deck_archetype);

  const totalDecks = reportedDecks.filter(finalDeck =>
    ifResultMatchesSchema(deck, finalDeck)
  );
  const day2Decks = reportedDecks.filter(
    finalDeck => ifResultMatchesSchema(deck, finalDeck) && finalDeck.day2
  );

  return day2Decks.length / totalDecks.length;
};

export const ConversionStat = memo(
  ({ deck, tournamentId }: { deck: DeckTypeSchema; tournamentId: string }) => {
    const shouldDrillDown = useContext(ShouldDrillDownMetaShareContext);
    const { decks } = useStoredDecks({
      tournamentId,
      shouldDrillDown,
    });

    const conversionRate = getConversionRate(deck, decks);

    return <Stat stat={conversionRate} label='Converted' />;
  }
);

ConversionStat.displayName = 'ConversionStat';
