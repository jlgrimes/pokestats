import { DeckTypeSchema } from '../../../hooks/deckArchetypes';

export type DeckCompareColumnType<T> = {
  name: T;
  label: (deck: DeckTypeSchema, decks: DeckTypeSchema[]) => string;
  shouldHide: (deck: DeckTypeSchema, decks: DeckTypeSchema[]) => boolean;
  calculation: (deck: DeckTypeSchema, decks: DeckTypeSchema[]) => number;
};

export interface DeckCompareSortTogglesProps<T> {
  sortBy: T;
  sortOrder: 'asc' | 'desc';
  columns: DeckCompareColumnType<T>[];
  setSort: (sortBy: T, sortOrder: 'asc' | 'desc') => void;
}