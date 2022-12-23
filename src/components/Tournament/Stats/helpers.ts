export const getArchetypeGraphData = (day2Decks: Record<string, any>[] | undefined) => {
  const deckCounts = day2Decks?.reduce((acc, curr) => {
    if (acc[curr.name]) {
      acc[curr.name] += 1;
    } else {
      acc[curr.name] = 1;
    }
    return acc;
  }, {});

  return Object.entries(deckCounts ?? {}).map(([deck, count]) => ({
    id: deck,
    label: deck,
    value: count,
  }));
};
