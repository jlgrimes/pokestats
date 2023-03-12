import PropagateLoader from 'react-spinners/PropagateLoader';
import { Box } from '@chakra-ui/react';

export const FullPageLoader = () => (
  <Box
    position={'fixed'}
    top={'50vh'}
    display={'flex'}
    justifyContent='center'
    width='100%'
    opacity={0.4}
  >
    <PropagateLoader />
  </Box>
);
