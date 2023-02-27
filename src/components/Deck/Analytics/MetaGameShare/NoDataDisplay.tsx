import { Heading, Stack } from '@chakra-ui/react';
import { memo } from 'react';

export const NoDataDisplay = memo(() => {
  return (
    <Heading
      color='gray.500'
      fontSize={20}
    >{`Tournament data on the way!`}</Heading>
  );
});

NoDataDisplay.displayName = 'NoDataDisplay';
