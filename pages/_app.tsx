import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useState } from 'react';
import { AppLayout } from '../src/components/Layout/AppLayout';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <AppLayout session={session} dehydratedState={pageProps.dehydratedState}>
      <Component {...pageProps} />
    </AppLayout>
  );
}
