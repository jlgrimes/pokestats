import { Box, Link } from '@chakra-ui/react';
import { CommonCard } from '../common/CommonCard';

export const TwitterTimeline = () => (
  <Box
    as={Link}
    className='twitter-timeline'
    href='https://twitter.com/pokestatstcg?ref_src=twsrc%5Etfw'
  ></Box>
);
