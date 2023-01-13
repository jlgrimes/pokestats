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

  return `https://images.pokemontcg.io/${set}/${card?.number}${options?.highRes ? '_hires' : ''}.png`;
};
