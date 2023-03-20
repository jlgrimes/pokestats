import { ColorMode } from '@chakra-ui/react';

export const getResultBackgroundColor = (
  matchResult: string | undefined,
  darkMode?: ColorMode
) => {
  if (darkMode)
    return matchResult === 'W'
      ? 'green.800'
      : matchResult === 'T'
      ? 'yellow.800'
      : matchResult === 'L'
      ? 'red.800'
      : undefined;

  return matchResult === 'W'
    ? 'green.100'
    : matchResult === 'T'
    ? 'yellow.100'
    : matchResult === 'L'
    ? 'red.100'
    : undefined;
};
