import { useColorMode } from '@chakra-ui/react';

export const useColor = () => {
  const { colorMode } = useColorMode();

  const activeColor = colorMode === 'dark' ? 'gray.100' : 'gray.900';
  const inactiveColor = colorMode === 'dark' ? 'gray.600' : 'gray.400';

  return {
    active: activeColor,
    inactive: inactiveColor,
  };
};
