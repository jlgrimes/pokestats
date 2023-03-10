export const getPercentile = (placing: number, numPlayers: number) => {
  return Math.floor((placing / numPlayers) * 100);
};
