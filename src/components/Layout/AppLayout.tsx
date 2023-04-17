import { Box, Container, extendTheme, Stack } from '@chakra-ui/react';
import React, { ReactNode, useCallback, useEffect } from 'react';
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
import { useSession } from 'next-auth/react';
import supabase from '../../lib/supabase/client';

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
  const session = useSession();
  const [shouldMockUser, setShouldMockUser] = useState(false);

  const checkForOldSession = useCallback(async () => {
    const supaSession = await supabase.auth.getSession();
    if (!supaSession.data.session && session?.data?.user?.name) {
      console.log(window.location.origin)
      supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
    }
  }, [session?.data?.user?.name]);

  useEffect(() => {
    checkForOldSession();
  }, [checkForOldSession]);

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
            <Container
              height='100%'
              alignItems='center'
              padding={
                router.asPath.includes('tournaments') ||
                router.asPath.includes('decks') ||
                router.asPath === '/'
                  ? 0
                  : 4
              }
            >
              {children}
              {/* <Footer /> */}
            </Container>
          </ChakraProvider>
        </userMockContext.Provider>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
