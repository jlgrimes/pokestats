import { Box, extendTheme, Stack } from '@chakra-ui/react';
import React, { ReactNode } from 'react';
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
import { Footer } from './Footer';
import { BetaBanner } from './BetaBanner';
import { userMockContext } from '../../contexts/MockUserContext';

const theme = extendTheme({
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
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));
  const router = useRouter();
  const [shouldMockUser, setShouldMockUser] = useState(false);

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
            {/* <BetaBanner /> */}
            <Stack
              height='100%'
              alignItems='center'
              padding={
                router.asPath.includes('tournaments') ||
                router.asPath.includes('decks') ||
                router.asPath === '/'
                  ? 0
                  : 4
              }
              spacing={1}
            >
              {children}
              {/* <Footer /> */}
            </Stack>
          </ChakraProvider>
        </userMockContext.Provider>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
