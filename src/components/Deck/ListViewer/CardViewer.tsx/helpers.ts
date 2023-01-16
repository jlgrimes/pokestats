import { Card, DeckList } from '../../../../../types/tournament';
import { getCompressedList } from '../helpers';

export const listContainsCard = (list: DeckList, card: Card) => {
  const listKeys: (keyof DeckList)[] = ['pokemon', 'trainer', 'energy'];

  return listKeys.some(supertype =>
    list[supertype].some(listCard => listCard.name === card.name)
  );
};

export const getCardCount = (list: DeckList, card: Card) => {
  const compressedList: Card[] = getCompressedList(list);

  return compressedList.find(({ name }) => name === card.name)?.count ?? 0;
};

export const fixPercentage = (percentNumber: number) => {
  if ((percentNumber * 100) % 100 === 0) {
    return Math.abs(percentNumber).toFixed(0);
  }

  return Math.abs(percentNumber).toFixed(1);
};
