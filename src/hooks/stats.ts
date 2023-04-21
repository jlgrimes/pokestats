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