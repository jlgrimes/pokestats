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
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Footer } from './Footer';
import { BetaBanner } from './BetaBanner';

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
          <Head>
            <title>PokéStats Live</title>
            <meta name='description' content='Pokestats' />
            <link rel='icon' href='/favicon.ico' />
          </Head>
          <AppBar />
          <BetaBanner />
          <Stack>
            <Stack
              padding={
                router.asPath.includes('tournaments') ||
                router.asPath.includes('decks')
                  ? 0
                  : 4
              }
              spacing={1}
              height='100%'
            >
              {children}
            </Stack>
            <Footer />
          </Stack>
        </ChakraProvider>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
