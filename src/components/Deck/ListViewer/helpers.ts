import { Card, DeckList } from '../../../../types/tournament';

export const getCardImageUrl = (
  card: {
    name: string;
    number: string;
    set: string;
  },
  codeToSetMap: Record<string, string> | undefined,
  options?: { highRes: boolean }
) => {
  let set = codeToSetMap?.[card.set];
  if (!set) {
    return '';
  }

  if (card.number.includes('SWSH')) {
    set = 'swshp';
  } else if (card.number.includes('TG')) {
    set = set.replace('tg', '').concat('tg');
  } else if (card.number.includes('SV')) {
    set = set.replace('sv', '').concat('sv');
  }

  return `https://images.pokemontcg.io/${set}/${card?.number}${
    options?.highRes ? '_hires' : ''
  }.png`;
};

const flattenOutEnergies = (card: Card) => {
  const numPiles = Math.ceil(card.count / 4);
  const lastPileCount = card.count % 4 === 0 ? 4 : card.count % 4;

  return [...Array(numPiles)].map((_, idx) => ({
    ...card,
    count: idx === numPiles - 1 ? lastPileCount : 4,
  }));
};

export const getCompressedList = (deckList: DeckList) => {
  const listKeys: (keyof DeckList)[] = ['pokemon', 'trainer', 'energy'];

  return listKeys.reduce(
    (acc: Card[], superclass) => [
      ...acc,
      ...deckList[superclass].reduce((acc: Card[], card: Card) => {
        if (card.count > 4) {
          return [...acc, ...flattenOutEnergies(card)];
        }

        const sameCardIdx = acc.findIndex(
          pushedCard =>
            pushedCard.name === card.name &&
            (pushedCard.set === card.set || card.set.includes('PR'))
        );
        if (sameCardIdx >= 0) {
          acc[sameCardIdx] = {
            ...acc[sameCardIdx],
            count: acc[sameCardIdx].count + card.count,
          };
          return acc;
        }

        return [...acc, card];
      }, []),
    ],
    []
  );
};

export const getCardSlug = (card: Card) =>
  `${card.name.toLowerCase().split(' ').join('-')}-${card.set.toLowerCase()}`;
