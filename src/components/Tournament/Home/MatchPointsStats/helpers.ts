interface MatchPointCutoffReturnType {
  match_points: number;
  cutoff_placing: number;
}

const placements = [1024, 512, 256, 128, 64, 32, 16, 8];

export const getPropsForMatchPointCutoffVisualization = (data: MatchPointCutoffReturnType[]) => {
  return placements.reduce((acc, curr, idx) => {
    const safeLowerBoundEntryIdx = data.findIndex((entry) => entry.cutoff_placing <= curr);
    const safeLowerBoundEntry = data[safeLowerBoundEntryIdx];

    const bubbleLowerBound = data[safeLowerBoundEntryIdx - 1];
    const safeUpperBound = idx + 1 < placements.length ? (placements[idx + 1] + 1) : 1;


    return {
      ...acc,
      [curr]: {
        onTheBubble: safeLowerBoundEntry.cutoff_placing === curr ? null : [bubbleLowerBound.cutoff_placing, safeLowerBoundEntry.cutoff_placing + 1],
        safe: [safeLowerBoundEntry.cutoff_placing, safeUpperBound]
      }
    }
  }, {});
}