import { getPropsForMatchPointCutoffVisualization } from "./helpers";

describe('when getPropsForMatchPointCutoffVisualization is called', () => {
  it('should return cutoffs in proper format', () => {
    const mockData = [{
      match_points: 26,
      cutoff_placing: 1100
    }, {
      match_points: 27,
      cutoff_placing: 600
    }, {
      match_points: 28,
      cutoff_placing: 300
    }, {
      match_points: 29,
      cutoff_placing: 200
    }, {
      match_points: 30,
      cutoff_placing: 100
    }, {
      match_points: 31,
      cutoff_placing: 40
    }, {
      match_points: 32,
      cutoff_placing: 32
    }, {
      match_points: 33,
      cutoff_placing: 22
    }, {
      match_points: 34,
      cutoff_placing: 15
    }, {
      match_points: 35,
      cutoff_placing: 8
    }, {
      match_points: 36,
      cutoff_placing: 4
    }];

    const res = getPropsForMatchPointCutoffVisualization(mockData);
    expect(res).toEqual({
      1024: {
        onTheBubble: [1100, 601],
        safe: [600, 513],
        onTheBubbleMatchPoints: 26,
        safeMatchPoints: 27
      },
      512: {
        onTheBubble: [600, 301],
        safe: [300, 257],
        onTheBubbleMatchPoints: 27,
        safeMatchPoints: 28
      },
      256: {
        onTheBubble: [300, 201],
        safe: [200, 129],
        onTheBubbleMatchPoints: 28,
        safeMatchPoints: 29
      },
      128: {
        onTheBubble: [200, 101],
        safe: [100, 65],
        onTheBubbleMatchPoints: 29,
        safeMatchPoints: 30
      },
      64: {
        onTheBubble: [100, 41],
        safe: [40, 33],
        onTheBubbleMatchPoints: 30,
        safeMatchPoints: 31
      },
      32: {
        onTheBubble: null,
        safe: [32, 17],
        onTheBubbleMatchPoints: null,
        safeMatchPoints: 32
      },
      16: {
        onTheBubble: [22, 16],
        safe: [15, 9],
        onTheBubbleMatchPoints: 33,
        safeMatchPoints: 34
      },
      8: {
        onTheBubble: null,
        safe: [8, 1],
        onTheBubbleMatchPoints: null,
        safeMatchPoints: 35
      }
    });
  });
});

export {};