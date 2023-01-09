export const getResultBackgroundColor = (matchResult: string | undefined) => {
  console.log(matchResult)
  return matchResult === 'W'
    ? 'green.100'
    : matchResult === 'T'
    ? 'yellow.100'
    : matchResult === 'L'
    ? 'red.100'
    : 'white';
};
