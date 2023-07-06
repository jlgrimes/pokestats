import { Deck } from '../../../../../types/tournament';
import { DeckTypeSchema, SupertypeSchema } from '../../../../hooks/deckArchetypes';

interface SuperTypeCollection {
  definedPokemon: string;
  archetypeName: string;
  decks: Deck[];
}

export const sortBySuperType = (
  mostPopularDecks: DeckTypeSchema[] | null | undefined
) => {
  if (!mostPopularDecks || mostPopularDecks.some((deck) => !deck)) return;

  const supertypeMap = mostPopularDecks.reduce((acc: Record<number, { supertype: SupertypeSchema, decks: Deck[] }>, curr: DeckTypeSchema) => {
    if (!curr.supertype?.id) return acc;

    if (acc[curr.supertype.id]) {
      return {
        ...acc,
        [curr.supertype.id]: {
          ...acc[curr.supertype.id],
          decks: [...acc[curr.supertype.id].decks, curr as unknown as Deck]
        }
      }
    }

    return {
      ...acc,
      [curr.supertype.id]: {
        supertype: curr.supertype,
        decks: [curr as unknown as Deck]
      }
    };
  }, {});

  const supertypes = Object.values(supertypeMap);

  return supertypes.sort((a, b) => {
    if (a.supertype.name === 'Other') return 1;
    if (b.supertype.name === 'Other') return -1;

    if (a.decks.length > b.decks.length) {
      return -1;
    }
    return 1;
  });
};
