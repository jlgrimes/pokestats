import { Deck } from '../../../../../types/tournament';

interface SuperTypeCollection {
  definedPokemon: string;
  archetypeName: string;
  decks: Deck[];
}

export const sortBySuperType = (mostPopularDecks: Deck[] | null | undefined) =>
  mostPopularDecks
    ?.reduce((acc: SuperTypeCollection[], curr: Deck) => {
      const foundSuperTypeIdx = acc.findIndex(
        supertype => supertype.definedPokemon === curr.defined_pokemon[0]
      );

      if (foundSuperTypeIdx >= 0) {
        return acc.map((supertype, idx) => {
          if (idx === foundSuperTypeIdx) {
            return {
              ...supertype,
              decks: [...supertype.decks, curr],
            };
          }
          return supertype;
        });
      }

      return [
        ...acc,
        {
          definedPokemon: curr.defined_pokemon[0],
          archetypeName: curr.supertype.name,
          decks: [curr],
        },
      ];
    }, [])
    .sort((a, b) => {
      if (a.decks.length > b.decks.length) {
        return -1;
      }
      return 1;
    });
