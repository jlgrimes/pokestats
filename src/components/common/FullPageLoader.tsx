import PropagateLoader from 'react-spinners/PropagateLoader';
import { Box } from '@chakra-ui/react';

export const FullPageLoader = () => (
  <Box
    position={'fixed'}
    top={'50vh'}
    display={'flex'}
    justifyContent='center'
    width='100%'
    color='gray.500'
  >
    <PropagateLoader color='#63b3ed' />
  </Box>
);
