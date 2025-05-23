import { Container, extendTheme, useColorMode } from '@chakra-ui/react';
import React, { ReactNode, useEffect } from 'react';
import { AppBar } from './AppBar/AppBar';
import { ChakraProvider } from '@chakra-ui/react';
import {
  DehydratedState,
  Hydrate,
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { userMockContext } from '../../contexts/MockUserContext';
import { useFixAutoHeight } from '../../hooks/useFixAutoHeight';
import { AppBody } from './AppBody';

const theme = extendTheme({
  fonts: {
    mono: `'Roboto Mono', monospace`,
  },
  components: { Button: { baseStyle: { _focus: { boxShadow: 'none' } } } },
});

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
      staleTime: 30000,
    },
  },
};

export const AppLayout = ({
  children,
  dehydratedState,
}: {
  children: ReactNode;
  dehydratedState?: DehydratedState;
}) => {
  useFixAutoHeight();
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));
  const [shouldMockUser, setShouldMockUser] = useState(false);

  return <div>Site is down until further notice. We'll be back, hopefully.</div>
  
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <userMockContext.Provider value={{ shouldMockUser, setShouldMockUser }}>
          <ChakraProvider theme={theme}>
            <Head>
              <title>PokéStats Live</title>
              <meta name='description' content='Pokestats' />
              <link rel='icon' href='/favicon.ico' />
            </Head>
            <AppBar />
            <AppBody>{children}</AppBody>
          </ChakraProvider>
        </userMockContext.Provider>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
