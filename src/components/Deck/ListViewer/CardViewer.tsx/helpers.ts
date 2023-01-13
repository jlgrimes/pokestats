import { Card, DeckList } from '../../../../../types/tournament';

export const listContainsCard = (list: DeckList, card: Card) => {
  const listKeys: (keyof DeckList)[] = ['pokemon', 'trainer', 'energy'];

  return listKeys.some(supertype =>
    list[supertype].some(
      listCard => listCard.name === card.name && listCard.set === card.set
    )
  );
};
