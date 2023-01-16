import { Deck } from "../../../../../types/tournament";

export const getNumberOfDecks = (decks: { count: number; deck: Deck }[]) =>
  decks.reduce((acc, curr) => acc + (curr.count ?? 0), 0);
