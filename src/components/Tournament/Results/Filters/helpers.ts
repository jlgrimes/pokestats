import { DeckArchetype } from '../../../../../types/tournament';

interface SuperTypeCollection {
  name: string;
  decks: DeckArchetype[];
}

export const sortBySuperType = (
  mostPopularDecks: DeckArchetype[] | null | undefined
) =>
  mostPopularDecks?.reduce(
    (acc: SuperTypeCollection[], curr: DeckArchetype) => {
      const foundSuperTypeIdx = acc.findIndex(
        supertype => supertype.name === curr.defined_pokemon[0]
      );

      if (foundSuperTypeIdx >= 0) {
        return acc.map((supertype, idx) => {
          if (idx === foundSuperTypeIdx) {
            return {
              name: supertype.name,
              decks: [...supertype.decks, curr],
            };
          }
          return supertype;
        });
      }

      return [
        ...acc,
        {
          name: curr.defined_pokemon[0],
          decks: [curr],
        },
      ];
    },
    []
  );
