import { DeckTypeSchema } from "./deckArchetypes";
import { FinalResultsDeckSchema } from "./finalResults/final-results-schema";

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