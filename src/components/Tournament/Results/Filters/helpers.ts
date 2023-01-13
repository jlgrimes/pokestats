import { DeckArchetype } from '../../../../../types/tournament';

interface SuperTypeCollection {
  definedPokemon: string;
  archetypeName: string;
  decks: DeckArchetype[];
}

export const sortBySuperType = (
  mostPopularDecks: DeckArchetype[] | null | undefined
) =>
  mostPopularDecks?.reduce(
    (acc: SuperTypeCollection[], curr: DeckArchetype) => {
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
          archetypeName: curr.supertype,
          decks: [curr],
        },
      ];
    },
    []
  );
