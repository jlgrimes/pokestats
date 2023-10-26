import { ColorMode } from '@chakra-ui/react';

export const getResultItemBackgroundColor = (
  matchResult: string | undefined,
  colorMode?: ColorMode
) => {
  if (colorMode === 'dark')
    return matchResult === 'W'
      ? 'green-800'
      : matchResult === 'T'
      ? 'yellow-800'
      : matchResult === 'L'
      ? 'red-800'
      : undefined;

  return matchResult === 'W'
    ? 'green-100'
    : matchResult === 'T'
    ? 'yellow-100'
    : matchResult === 'L'
    ? 'red-100'
    : undefined;
};

export const getResultItemPrimaryColor = (matchResult: string | undefined) => matchResult === 'W'
? 'green-500'
: matchResult === 'T'
? 'yellow-500'
: matchResult === 'L'
? 'red-500'
: undefined