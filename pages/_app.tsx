import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AppLayout } from '../src/components/Layout/AppLayout';
import { SessionProvider } from 'next-auth/react';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <AppLayout dehydratedState={pageProps.dehydratedState}>
        <Component {...pageProps} />
      </AppLayout>
    </SessionProvider>
  );
}
