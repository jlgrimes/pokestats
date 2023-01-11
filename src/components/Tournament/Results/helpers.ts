export const getPercentile = (placing: number, numPlayers: number) => {
  return Math.floor((1 - placing / numPlayers) * 100);
};
