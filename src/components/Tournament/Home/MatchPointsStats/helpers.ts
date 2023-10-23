interface MatchPointCutoffReturnType {
  match_points: number;
  cutoff_placing: number;
}

export interface MatchPointVizReturnType {
  onTheBubble: number[] | null;
  onTheBubbleMatchPoints: number | null;
  safe: number[];
  safeMatchPoints: number;
}

const placements = [1024, 512, 256, 128, 64, 32, 16, 8];

export const getPropsForMatchPointCutoffVisualization = (data: MatchPointCutoffReturnType[]): Record<number, MatchPointVizReturnType> => {
  return placements.reduce((acc, curr, idx) => {
    // Ignore if the match point tier is greater than any of the cutoffs
    if (curr > Math.max(...data.map((entry) => entry.cutoff_placing))) return acc;

    const safeLowerBoundEntryIdx = data.findIndex((entry) => entry.cutoff_placing <= curr);
    const safeLowerBoundEntry = data[safeLowerBoundEntryIdx];

    const bubbleLowerBound = data[safeLowerBoundEntryIdx - 1];
    const safeUpperBound = idx + 1 < placements.length ? (placements[idx + 1] + 1) : 1;

    const onTheBubbleMatchPoints = safeLowerBoundEntry.cutoff_placing === curr ? null : bubbleLowerBound.match_points;
    const safeMatchPoints = onTheBubbleMatchPoints ? onTheBubbleMatchPoints + 1 : safeLowerBoundEntry.match_points;

    return {
      ...acc,
      [curr]: {
        onTheBubble: safeLowerBoundEntry.cutoff_placing === curr ? null : [bubbleLowerBound.cutoff_placing, safeLowerBoundEntry.cutoff_placing + 1],
        onTheBubbleMatchPoints,
        safe: [safeLowerBoundEntry.cutoff_placing, safeUpperBound],
        safeMatchPoints
      }
    }
  }, {});
}