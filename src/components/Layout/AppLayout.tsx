import { Stack } from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import { AppBar } from './AppBar';

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Stack spacing={1}>
      <AppBar />
      {children}
    </Stack>
  );
};
