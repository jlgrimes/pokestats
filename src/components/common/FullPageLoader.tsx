import RingLoader from 'react-spinners/RingLoader';
import { Box } from '@chakra-ui/react';

export const FullPageLoader = () => (
  <Box
    position={'fixed'}
    top={'50%'}
    left='50%'
    display={'flex'}
    justifyContent='center'
    opacity={0.4}
    transform='translate(-50%,-50%)'
  >
    <RingLoader color='red' />
  </Box>
);
