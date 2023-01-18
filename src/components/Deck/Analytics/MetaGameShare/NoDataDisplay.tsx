import { Heading, Stack } from '@chakra-ui/react';
import { memo } from 'react';

export const NoDataDisplay = memo(() => {
  return (
    <Stack justifyContent={'center'} alignItems='center'>
      <Heading color='gray.500'>{`No data available for this tournament :(`}</Heading>
    </Stack>
  );
});

NoDataDisplay.displayName = 'NoDataDisplay';
