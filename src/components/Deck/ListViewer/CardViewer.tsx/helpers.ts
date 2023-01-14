import { Card, DeckList } from '../../../../../types/tournament';

export const listContainsCard = (list: DeckList, card: Card) => {
  const listKeys: (keyof DeckList)[] = ['pokemon', 'trainer', 'energy'];

  return listKeys.some(supertype =>
    list[supertype].some(
      listCard => listCard.name === card.name && listCard.set === card.set
    )
  );
};

export const getCardCount = (list: DeckList, card: Card) => {
  const listKeys: (keyof DeckList)[] = ['pokemon', 'trainer', 'energy'];

  for (const supertype of listKeys) {
    const foundCard = list[supertype].find(
      listCard => listCard.name === card.name && listCard.set === card.set
    );

    if (foundCard) {
      return foundCard.count;
    }
  }

  return 0;
};
