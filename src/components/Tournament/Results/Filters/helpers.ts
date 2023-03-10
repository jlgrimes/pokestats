import { Deck } from '../../../../../types/tournament';
import { DeckTypeSchema } from '../../../../hooks/deckArchetypes';

interface SuperTypeCollection {
  definedPokemon: string;
  archetypeName: string;
  decks: Deck[];
}

export const sortBySuperType = (
  mostPopularDecks: DeckTypeSchema[] | null | undefined
) => {
  if (!mostPopularDecks) return;

  const ret = mostPopularDecks.reduce(
    (acc: SuperTypeCollection[], curr: DeckTypeSchema) => {
      const foundSuperTypeIdx = acc.findIndex(
        supertype => supertype.definedPokemon === curr.defined_pokemon[0]
      );

      if (foundSuperTypeIdx >= 0) {
        return acc.map((supertype, idx) => {
          if (idx === foundSuperTypeIdx) {
            return {
              ...supertype,
              decks: [...supertype.decks, curr as unknown as Deck],
            };
          }
          return supertype;
        });
      }

      return acc;

      // return [
      //   ...acc,
      //   {
      //     definedPokemon: curr.defined_pokemon[0],
      //     archetypeName: curr.supertype.name,
      //     decks: [curr],
      //   },
      // ];
    },
    []
  );

  return ret.sort((a, b) => {
    if (a.decks.length > b.decks.length) {
      return -1;
    }
    return 1;
  });
};
