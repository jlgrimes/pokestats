import { memo } from 'react';
import { DeckTypeSchema } from '../../../hooks/deckArchetypes';
import { Stat } from '../../common/Stat';
import { DeckCompareColumnType } from './DeckCompareSortToggles';

export const GenericStat = memo(
  <T extends string>({
    deck,
    decks,
    column,
    isInactive,
    shouldHideLabel
  }: {
    deck: DeckTypeSchema;
    decks: DeckTypeSchema[];
    column: DeckCompareColumnType<T>;
    isInactive?: boolean;
    shouldHideLabel?: boolean;
  }) => {
    const stat = column.calculation(deck, decks);
    if (!stat || column.shouldHide(deck, decks)) return null;

    return (
      <Stat
        stat={stat}
        label={column.label(deck, decks)}
        isInactive={isInactive}
        shouldHideLabel={shouldHideLabel}
      />
    );
  }
);

GenericStat.displayName = 'GenericStat';
