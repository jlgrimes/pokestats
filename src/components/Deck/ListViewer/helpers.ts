import { DeckCard, DeckList } from '../../../../types/tournament';

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

const flattenOutEnergies = (card: DeckCard) => {
  const numPiles = Math.ceil(card.count / 4);
  const lastPileCount = card.count % 4 === 0 ? 4 : card.count % 4;

  return [...Array(numPiles)].map((_, idx) => ({
    ...card,
    count: idx === numPiles - 1 ? lastPileCount : 4,
  }));
};

export const isSpecialCard = (card: Partial<DeckCard>) => {
  if (!card.name || !card.set) return false;

  return (
    ['ex', 'EX', 'GX', 'V', 'VSTAR', 'VMAX', 'Inteleon', 'Oranguru'].some(cardType =>
      card.name!.includes(cardType)
    ) || ['SHF', 'PR'].some(specialSet => card.set!.includes(specialSet))
  );
};

export const getSameCardIdx = (compressedList: DeckCard[], card: DeckCard) => {
  return compressedList.findIndex(pushedCard => {
    if (isSpecialCard(card) || isSpecialCard(pushedCard)) return pushedCard.name === card.name;
    return pushedCard.name === card.name && pushedCard.set === card.set;
  });
};

export const getCompressedList = (deckList: DeckList, flattenEnergies?: boolean) => {
  const listKeys: (keyof DeckList)[] = ['pokemon', 'trainer', 'energy'];

  return listKeys.reduce(
    (acc: DeckCard[], superclass) => [
      ...acc,
      ...deckList[superclass].reduce((acc: DeckCard[], card: DeckCard) => {
        if (flattenEnergies && card.count > 4) {
          return [...acc, ...flattenOutEnergies(card)];
        }

        const sameCardIdx = getSameCardIdx(acc, card);
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

export const getCardSlug = (card: DeckCard) =>
  `${card.name.toLowerCase().split(' ').join('-')}-${card.set.toLowerCase()}`;
