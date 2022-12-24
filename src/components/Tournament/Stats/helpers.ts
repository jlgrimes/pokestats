export const getArchetypeKey = (
  deck: Record<string, any>,
  shouldDrillDown: boolean
) => (shouldDrillDown ? deck.name : (deck.supertype ?? deck.defined_pokemon?.[0]));

export const getArchetypeGraphData = (
  day2Decks: Record<string, any>[] | undefined,
  shouldDrillDown: boolean
) => {
  const deckCounts = day2Decks?.reduce((acc, curr) => {
    const archetypeKey = getArchetypeKey(curr, shouldDrillDown);

    if (acc[archetypeKey]) {
      acc[archetypeKey] += 1;
    } else {
      acc[archetypeKey] = 1;
    }
    return acc;
  }, {});

  return Object.entries(deckCounts ?? {})
    .map(([deck, count]) => ({
      name: deck,
      value: count,
    }))
    .sort((a, b) => {
      if (a.value > b.value) {
        return -1;
      }
      return 1;
    });
};
