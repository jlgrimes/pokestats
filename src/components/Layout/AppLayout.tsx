import { extendTheme, Stack } from '@chakra-ui/react';
import React, { ReactNode } from 'react';
import { AppBar } from './AppBar/AppBar';
import { ChakraProvider } from '@chakra-ui/react';
import {
  DehydratedState,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useState } from 'react';
import { useRouter } from 'next/router';

const theme = extendTheme({
  components: { Button: { baseStyle: { _focus: { boxShadow: 'none' } } } },
});

export const AppLayout = ({
  children,
  dehydratedState,
}: {
  children: ReactNode;
  dehydratedState?: DehydratedState;
}) => {
  const [queryClient] = useState(() => new QueryClient());
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <ChakraProvider theme={theme}>
          <AppBar />
          <Stack padding={router.asPath.includes('standings') ? 0 : 4} spacing={1} height='100%'>
            {children}
          </Stack>
        </ChakraProvider>
      </Hydrate>
    </QueryClientProvider>
  );
};
