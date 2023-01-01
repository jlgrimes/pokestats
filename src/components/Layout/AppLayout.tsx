import { Stack } from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import { AppBar } from './AppBar';
import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useState } from 'react';

export const AppLayout = ({
  children,
  session,
  dehydratedState,
}: {
  children: ReactNode;
  session;
  dehydratedState;
}) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={dehydratedState}>
          <ChakraProvider>
            <Stack spacing={1}>
              <AppBar />
              {children}
            </Stack>
          </ChakraProvider>
        </Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  );
};
