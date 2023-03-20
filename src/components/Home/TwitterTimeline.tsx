import { Box, Link, useColorMode } from '@chakra-ui/react';

export const TwitterTimeline = () => {
  const { colorMode } = useColorMode();

  return (
    <Box
      as={Link}
      className='twitter-timeline'
      href='https://twitter.com/pokestatstcg?ref_src=twsrc%5Etfw'
      data-theme={colorMode}
    ></Box>
  );
};
